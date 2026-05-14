from fastapi import FastAPI
from pydantic import BaseModel
import joblib, uvicorn
import pandas as pd

app = FastAPI()

models  = joblib.load("health_models_20260514.pkl")
results = joblib.load("health_model_scores_20260514.pkl")

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

@app.post("/predict")
async def predict(data: UserInput):
    weight_diff = data.weight - data.target_weight
    if weight_diff <= 0:
        return {"error": "목표 체중이 현재보다 크거나 같습니다."}

    inp = pd.DataFrame([{
        "gender":     data.gender,
        "age_code":   data.age_code,
        "height":     data.height,
        "smoke":      data.smoke,
        "drink":      data.drink,
        "weight_pre": data.weight,
        "weight_diff":weight_diff,
        "waist_pre":  data.waist,
        "sbp_pre":    data.sbp,
        "dbp_pre":    data.dbp,
        "bs_pre":     data.bs,
        "tg_pre":     data.tg,
        "hdl_pre":    data.hdl,
    }]).astype("float32")

    lower_bounds = {
        "delta_waist": -40, "delta_sbp": -60, "delta_dbp": -40,
        "delta_bs": -80,    "delta_tg": -400, "delta_hdl": -30,
    }
    upper_bounds = {"delta_hdl": 30}

    result = {}
    for key, name in [
        ("delta_waist","허리둘레"), ("delta_sbp","수축기혈압"),
        ("delta_dbp","이완기혈압"), ("delta_bs","공복혈당"),
        ("delta_tg","중성지방"),   ("delta_hdl","HDL"),
    ]:
        pre_key = key.replace("delta_","")
        curr  = float(getattr(data, pre_key if pre_key != "waist" else "waist"))
        delta = float(models[key].predict(inp)[0])
        delta = max(delta, lower_bounds[key])
        if key in upper_bounds:
            delta = min(delta, upper_bounds[key])
        result[name] = {
            "current":   curr,
            "predicted": round(curr + delta, 1),
            "delta":     round(delta, 1),
            "mae":       round(results[key]["mae"], 1),
        }

    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)