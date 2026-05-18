from fastapi import FastAPI
from pydantic import BaseModel
import joblib, uvicorn
import pandas as pd

app = FastAPI()

# pkl 파일명을 새로 학습한 파일로 변경 (괄호 없는 이름 권장)
models  = joblib.load("health_models_v4.pkl")
results = joblib.load("health_model_scores_v4.pkl")

class UserInput(BaseModel):
    gender: int
    age_code: int
    height: float
    smoke: int
    drink: int
    weight: float
    target_weight: float
    waist: float
    sbp: float
    dbp: float
    bs: float
    tg: float
    hdl: float

# 공통 설정
METRIC_INFO = [
    ("delta_waist", "waist", "허리둘레",   "cm"),
    ("delta_sbp",   "sbp",   "수축기혈압", "mmHg"),
    ("delta_dbp",   "dbp",   "이완기혈압", "mmHg"),
    ("delta_bs",    "bs",    "공복혈당",   "mg/dL"),
    ("delta_tg",    "tg",    "중성지방",   "mg/dL"),
    ("delta_hdl",   "hdl",   "HDL",        "mg/dL"),
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
    """6개 지표 예측 후 딕셔너리 반환"""
    result = {}
    for key, pre_key, name, unit in METRIC_INFO:
        curr      = float(getattr(data, pre_key))
        delta_raw = float(models[key].predict(inp)[0])
        delta     = max(delta_raw, LOWER_BOUNDS[key])
        if key in UPPER_BOUNDS:
            delta = min(delta, UPPER_BOUNDS[key])
        result[name] = {
            "current":   curr,
            "predicted": round(curr + delta, 1),
            "delta":     round(delta, 1),
            "mae":       round(results[key]["mae"], 1),
            "unit":      unit,
        }
    return result


# ── /predict: 단일 목표 체중 예측 ─────────────────────────────
@app.post("/predict")
async def predict(data: UserInput):
    weight_diff = data.weight - data.target_weight

    if weight_diff < 0:
        return {"error": "increase", "message": "목표 체중이 현재 체중보다 높습니다."}
    if weight_diff == 0:
        return {"error": "same", "message": "목표 체중이 현재 체중과 같습니다."}

    inp = build_inp(data, weight_diff)
    return predict_metrics(inp, data)


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
        if target < 45:   # 체중 하한 45kg
            break

        inp = build_inp(data, float(kg))
        predictions[f"{kg}kg"] = predict_metrics(inp, data)

    return {
        "predictions":   predictions,   # 1kg ~ max_loss_kg 전체
        "max_loss_kg":   max_loss_kg,   # 슬라이더 최대값
        "current_bmi":   round(bmi, 1),
        "normal_weight": normal_weight, # 정상체중 상한 (BMI 24.9)
        "to_normal":     to_normal,     # 정상체중까지 남은 kg
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
