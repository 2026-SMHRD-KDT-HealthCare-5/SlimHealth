# SlimHealth Python FastAPI 서버

## 개요
XGBoost 모델 기반 체중 감량 시 대사증후군 지표 예측 FastAPI 서버

## 📁 파일 구조

```
python/server/
├── FastAPI.py              # FastAPI 서버 메인 파일
├── health_models_v4.pkl      # 학습된 ML 모델 (6개 지표)
└── health_model_scores_v4.pkl # 모델 성능 점수 (MAE 등)
```


## ⚙️ 실행 방법

```bash
cd slimHealth/slimhealth/python/server
python FastAPI.py
```

서버 기본 포트: `8081`
접속 주소: `http://localhost:8081`

---

## 📥 공통 요청 파라미터 (Request Body)

| 파라미터 | 타입 | 설명 |
|---|---|---|
| `gender` | int | 성별 (1: 남성, 2: 여성) |
| `age_code` | int | 나이 코드 (7~12, 아래 참고) |
| `height` | float | 키 (cm) |
| `weight` | float | 현재 체중 (kg) |
| `waist` | float | 허리둘레 (cm) |
| `sbp` | float | 수축기혈압 (mmHg) |
| `dbp` | float | 이완기혈압 (mmHg) |
| `bs` | float | 공복혈당 (mg/dL) |
| `tg` | float | 중성지방 (mg/dL) |
| `hdl` | float | HDL 콜레스테롤 (mg/dL) |
| `smoke` | int | 흡연 여부 (1: 흡연, 0: 비흡연) |
| `drink` | int | 음주 여부 (1: 음주, 0: 비음주) |

### age_code 변환표

| 나이 | age_code |
|---|---|
| 25 ~ 34세 | 7 |
| 35 ~ 39세 | 8 |
| 40 ~ 44세 | 9 |
| 45 ~ 49세 | 10 |
| 50 ~ 54세 | 11 |
| 55 ~ 59세 | 12 |

> ⚠️ 25세 미만, 60세 이상은 서비스 대상 외입니다.

---

## 🔗 API 엔드포인트



###  `POST /predict-all` — 1kg 단위 전체 예측 (슬라이더용)

1kg부터 BMI 기반 최대 감량까지 모든 구간의 예측값을 한 번에 반환합니다.
프론트엔드 슬라이더 초기화 시 사용합니다.


**응답 예시**
```json
{
  "predictions": {
    "1kg": {
      "waist": { "current": 88.0, "predicted": 87.1, "delta": -0.9, "mae": 2.1, "unit": "cm" },
      "sbp": { ... },
      ...
    },
    "2kg": { ... },
    "15kg": { ... }
  },
  "max_loss_kg": 15,
  "current_bmi": 27.7,
  "normal_weight": 71.9,
  "to_normal": 8.1
}
```

| 응답 필드 | 설명 |
|---|---|
| `predictions` | 감량량별 6개 지표 예측 결과 |
| `max_loss_kg` | BMI 기반 현실적 최대 감량 (슬라이더 최대값) |
| `current_bmi` | 현재 BMI |
| `normal_weight` | 정상 체중 (BMI 24.9 기준) |
| `to_normal` | 정상 체중까지 남은 감량량 (kg) |

---

## 📊 예측 지표 상세

| 지표 | 키 | 단위 | delta 하한 |
|---|---|---|---|
| 허리둘레 | `waist` | cm | -40 |
| 수축기혈압 | `sbp` | mmHg | -60 |
| 이완기혈압 | `dbp` | mmHg | -40 |
| 공복혈당 | `bs` | mg/dL | -80 |
| 중성지방 | `tg` | mg/dL | -400 |
| HDL 콜레스테롤 | `hdl` | mg/dL | -30 (상한 +30) |

> HDL은 하한 -30, 상한 +30으로 양방향 클리핑 처리됩니다.

---

## 🧠 BMI별 최대 감량 기준

| BMI 구간 | 최대 감량 |
|---|---|
| < 22 | 8kg |
| 22 ~ 24 | 10kg |
| 25 ~ 26 | 12kg |
| 27 ~ 29 | 15kg |
| 30 ~ 31 | 20kg |
| 32 ~ 34 | 25kg |
| 35 ~ 37 | 30kg |
| 38 ~ 39 | 35kg |
| ≥ 40 | 50kg |

---

## 🛠️ 의존성

```bash
pip install fastapi uvicorn joblib pandas pydantic
```