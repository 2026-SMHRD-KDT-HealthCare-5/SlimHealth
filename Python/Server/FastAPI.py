from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, uvicorn
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

models  = joblib.load("health_models_v6.pkl")
results = joblib.load("health_model_scores_v6.pkl")

class UserInput(BaseModel):
    gender: int
    age_code: int
    height: float
    smoke: int
    drink: int
    weight: float
    waist: float
    sbp: float
    dbp: float
    bs: float
    tg: float
    hdl: float

# 공통 설정
# (delta_key, input_key, output_key, unit)
# output_key: 영문 키 사용 → React에서 data.waist, data.sbp 등으로 접근
METRIC_INFO = [
    ("delta_waist", "waist", "waist", "cm"),
    ("delta_sbp",   "sbp",   "sbp",   "mmHg"),
    ("delta_dbp",   "dbp",   "dbp",   "mmHg"),
    ("delta_bs",    "bs",    "bs",    "mg/dL"),
    ("delta_tg",    "tg",    "tg",    "mg/dL"),
    ("delta_hdl",   "hdl",   "hdl",   "mg/dL"),
]
LOWER_BOUNDS = {
    "delta_waist": -40, "delta_sbp": -60, "delta_dbp": -40,
    "delta_bs":    -80, "delta_tg": -400, "delta_hdl": -30,
}
UPPER_BOUNDS = {"delta_hdl": 30}

def get_max_loss_kg(bmi: float) -> int:
    """BMI 구간별 현실적인 최대 감량 (9단계 세분화)"""
    if bmi < 22:   return 8
    elif bmi < 25: return 10
    elif bmi < 27: return 12
    elif bmi < 30: return 15
    elif bmi < 32: return 20
    elif bmi < 35: return 25
    elif bmi < 38: return 30
    elif bmi < 40: return 35
    else:          return 50

def build_inp(data: UserInput, weight_diff: float) -> pd.DataFrame:
    """모델 입력 데이터프레임 생성"""
    return pd.DataFrame([{
        "gender":      data.gender,
        "age_code":    data.age_code,
        "height":      data.height,
        "smoke":       data.smoke,
        "drink":       data.drink,
        "weight_pre":  data.weight,
        "weight_diff": weight_diff,
        "waist_pre":   data.waist,
        "sbp_pre":     data.sbp,
        "dbp_pre":     data.dbp,
        "bs_pre":      data.bs,
        "tg_pre":      data.tg,
        "hdl_pre":     data.hdl,
    }]).astype("float32")

def predict_metrics(inp: pd.DataFrame, data: UserInput) -> dict:
    """6개 지표 예측 후 영문 키 딕셔너리 반환"""
    result = {}
    for delta_key, input_key, output_key, unit in METRIC_INFO:
        curr      = float(getattr(data, input_key))
        delta_raw = float(models[delta_key].predict(inp)[0])
        delta     = max(delta_raw, LOWER_BOUNDS[delta_key])
        if delta_key in UPPER_BOUNDS:
            delta = min(delta, UPPER_BOUNDS[delta_key])
        result[output_key] = {
            "current":   curr,
            "predicted": round(curr + delta, 1),
            "delta":     round(delta, 1),
            "mae":       round(results[delta_key]["mae"], 1),
            "unit":      unit,
        }
    return result



# ── /predict-all: 1kg 단위 전체 예측 (슬라이더용) ─────────────
@app.post("/predict-all")
async def predict_all(data: UserInput):
    bmi           = data.weight / ((data.height / 100) ** 2)
    max_loss_kg   = get_max_loss_kg(bmi)
    normal_weight = round(24.9 * ((data.height / 100) ** 2), 1)
    to_normal     = round(data.weight - normal_weight, 1)

    predictions = {}

    for kg in range(1, max_loss_kg + 1):
        target = data.weight - kg
        if target < 45:
            break
        inp = build_inp(data, float(kg))
        predictions[f"{kg}kg"] = predict_metrics(inp, data)

    return {
        "predictions":   predictions,
        "max_loss_kg":   max_loss_kg,
        "current_bmi":   round(bmi, 1),
        "normal_weight": normal_weight,
        "to_normal":     to_normal,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)
