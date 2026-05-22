# 🤖 SlimHealth - Node.js AI 파이프라인

Gemini API를 활용한 OCR 분석, 건강 조언 생성, 전체 파이프라인 실행 모듈입니다.

---

## 📁 파일 구조

```
node/
├── geminiClient.js   # Gemini API 키 로테이션 공통 모듈
├── ocr.js            # 건강검진 이미지 → 10개 지표 JSON 추출
├── healthAdvice.js   # 현재 수치 + 예측 수치 → 건강 조언 생성
└── pipeline.js       # OCR → FastAPI 예측 → 건강 조언 전체 실행
```

---

## ⚙️ 환경 설정

### 1. 패키지 설치

```bash
npm install @google/genai axios dotenv
```

### 2. `.env` 파일 설정

```env
GEMINI_API_KEY_1=your_key_1
GEMINI_API_KEY_2=your_key_2
GEMINI_API_KEY_3=your_key_3
GEMINI_API_KEY_4=your_key_4
```

> 키는 1개만 있어도 동작하며, 최대 4개까지 등록할 수 있습니다.
> 429(Rate Limit) 또는 503(Unavailable) 오류 발생 시 자동으로 다음 키로 전환됩니다.

---

## 📦 모듈 상세

---

### `geminiClient.js` — Gemini API 공통 클라이언트

모든 모듈에서 import하여 사용하는 공통 유틸리티입니다.

#### 제공 함수

| 함수 | 설명 |
|---|---|
| `getAI()` | 현재 활성 키로 GoogleGenAI 인스턴스 반환 |
| `rotateKey(errorMsg)` | 오류 메시지 기반 API 키 자동 교체 |
| `retryOnError(fn, label)` | 오류 시 최대 3회 재시도 (키 로테이션 포함) |

#### 재시도 전략

| 오류 유형 | 대기 시간 |
|---|---|
| 키 교체 성공 | 1초 |
| 429 Rate Limit | 10초 |
| 503 Unavailable | 5초 |

---

### `ocr.js` — 건강검진 이미지 OCR

건강검진 이미지(또는 PDF)를 Gemini Vision으로 분석하여 10개 수치를 JSON으로 추출합니다.

#### 지원 파일 형식

`png`, `jpg`, `jpeg`, `webp`, `gif`, `bmp`, `pdf`

#### 제공 함수

**`runOCR(fileNames)`**

```javascript
import { runOCR } from './ocr.js';

const result = await runOCR(['검진결과_1.png', '검진결과_2.png']);
```

**반환 JSON 구조**

```json
{
  "gender": 1,
  "age": 42,
  "height": 170.0,
  "weight": 80.0,
  "waist": 88.0,
  "sbp": 128,
  "dbp": 82,
  "bs": 102,
  "tg": 160,
  "hdl": 42
}
```

| 필드 | 설명 |
|---|---|
| `gender` | 성별 (1: 남성, 2: 여성) |
| `age` | 검진 기준 만 나이 |
| `height` | 키 (cm) |
| `weight` | 체중 (kg) |
| `waist` | 허리둘레 (cm) |
| `sbp` / `dbp` | 수축기 / 이완기 혈압 (mmHg) |
| `bs` | 공복혈당 (mg/dL) |
| `tg` | 중성지방 (mg/dL) |
| `hdl` | HDL 콜레스테롤 (mg/dL) |

> ⚠️ HDL은 LDL, 총콜레스테롤과 혼동하지 않도록 프롬프트에 명시적 주의사항이 포함되어 있습니다.

---

**`validateOCR(ocr)`**

OCR 결과가 정상 범위인지 검사합니다.

```javascript
import { validateOCR } from './ocr.js';
const isValid = validateOCR(ocrResult); // true / false
```

| 항목 | 정상 범위 |
|---|---|
| height | 130 ~ 210 cm |
| weight | 30 ~ 160 kg |
| waist | 40 ~ 150 cm |
| sbp | 70 ~ 250 mmHg |
| dbp | 40 ~ 150 mmHg |
| bs | 50 ~ 400 mg/dL |
| tg | 5 ~ 500 mg/dL |
| hdl | 10 ~ 200 mg/dL |

---

**`getAgeCode(age)`**

나이를 FastAPI 입력용 `age_code`로 변환합니다.

```javascript
import { getAgeCode } from './ocr.js';
const code = getAgeCode(42); // → 9
```

| 나이 | age_code |
|---|---|
| 25 ~ 34세 | 7 |
| 35 ~ 39세 | 8 |
| 40 ~ 44세 | 9 |
| 45 ~ 49세 | 10 |
| 50 ~ 54세 | 11 |
| 55 ~ 59세 | 12 |
| 25세 미만 / 60세 이상 | `null` (서비스 대상 외) |

---

### `healthAdvice.js` — Gemini 건강 조언 생성

현재 수치와 감량별 예측 수치를 분석하여 맞춤형 건강 조언 JSON을 생성합니다.

#### 함수

**`getHealthAdvice(ocrResult, userInput, currentMetrics, allPredictions)`**

```javascript
import { getHealthAdvice } from './healthAdvice.js';

const advice = await getHealthAdvice(ocrResult, userInput, currentMetrics, predictions);
```

| 파라미터 | 설명 |
|---|---|
| `ocrResult` | OCR 추출 결과 (`age`, `weight` 포함) |
| `userInput` | 사용자 입력 (`gender`, `smoke`, `drink`) |
| `currentMetrics` | 현재 6개 지표 (`waist`, `sbp`, `dbp`, `bs`, `tg`, `hdl`) |
| `allPredictions` | FastAPI `/predict-all` 응답의 `predictions` 객체 |

#### 반환 JSON 구조

```json
{
  "overall_summary": "대사증후군 위험 단계입니다.",
  "risk_level": "위험",
  "syndrome_count": 3,
  "recommended_loss_kg": 8,
  "recommended_reason": "8kg 감량 시 혈압·혈당 정상 진입",
  "advices": [
    {
      "indicator": "허리둘레",
      "status": "위험",
      "current_value": "88cm",
      "standard": "남성 90cm 미만",
      "message": "현재 기준에 근접한 수치입니다. 복부 비만 관리가 필요합니다."
    }
  ],
  "lifestyle_tips": {
    "diet": "...",
    "exercise": "...",
    "habit": "..."
  },
  "total_advice": "종합 건강 조언 (1000자 이내)..."
}
```

| 필드 | 설명 |
|---|---|
| `overall_summary` | 전체 건강 상태 한 줄 요약 (30자 이내) |
| `risk_level` | `"정상"` / `"주의"` / `"위험"` |
| `syndrome_count` | 대사증후군 해당 항목 수 (5개 중) |
| `recommended_loss_kg` | 지표 정상화를 위한 최소 권장 감량 (kg) |
| `recommended_reason` | 추천 감량량 선정 이유 |
| `advices` | 지표별 상태 및 조언 (배열) |
| `lifestyle_tips` | 식단 / 운동 / 생활습관 각 2문장 |
| `total_advice` | 통합 종합 조언 (흡연/음주 반영, ~1000자) |

---

### `pipeline.js` — 전체 파이프라인 실행

OCR → FastAPI 예측 → Gemini 건강 조언을 순서대로 실행하여 최종 JSON을 반환합니다.

#### 실행 방법

```bash
node pipeline.js
```

#### 실행 흐름

```
[STEP 1] Gemini OCR 분석
         ↓ 건강검진 이미지 → 10개 수치 추출
[STEP 2] FastAPI 예측
         ↓ http://localhost:8081/predict-all 호출
[STEP 3] Gemini 건강 조언 생성
         ↓ 예측 수치 기반 맞춤 조언 JSON 생성
[OUTPUT] 최종 통합 JSON 반환
```

#### 최종 출력 JSON 구조

```json
{
  "ocr": {
    "gender": 1, "age": 42, "height": 170.0, "weight": 80.0,
    "waist": 88.0, "sbp": 128, "dbp": 82, "bs": 102, "tg": 160, "hdl": 42
  },
  "predictions": {
    "predictions": {
      "1kg": {
        "target_weight": 79.0,
        "waist": 87.1, "sbp": 127.0, "dbp": 81.5,
        "bs": 101.0, "tg": 158.0, "hdl": 42.5
      },
      "2kg": { ... }
    },
    "max_loss_kg": 15,
    "current_bmi": 27.7,
    "normal_weight": 71.9,
    "to_normal": 8.1
  },
  "advice": {
    "overall_summary": "...",
    "risk_level": "위험",
    "syndrome_count": 3,
    "recommended_loss_kg": 8,
    ...
  }
}
```

#### 에러 처리

| 오류 | 원인 | 해결 방법 |
|---|---|---|
| `ECONNREFUSED` | FastAPI 서버 미실행 | `python main_test.py` 먼저 실행 |
| `서비스 대상 아님` | 나이 범위 초과 | 25 ~ 59세만 서비스 가능 |
| `분석할 파일이 없습니다` | 파일 경로 오류 | `fileNames` 배열의 파일명 확인 |

---

## 🔄 전체 연동 흐름

```
프론트엔드
    │ 건강검진 이미지 업로드 + 흡연/음주 입력
    ▼
Node.js pipeline.js
    │
    ├─ [1] ocr.js        → Gemini Vision으로 이미지 분석
    ├─ [2] FastAPI        → ML 모델 예측 (http://localhost:8081)
    └─ [3] healthAdvice.js → Gemini로 맞춤 건강 조언 생성
    │
    ▼ 최종 JSON (ocr + predictions + advice)
프론트엔드
```

---

## 🛠️ 의존성

```bash
npm install @google/genai axios dotenv
```

| 패키지 | 용도 |
|---|---|
| `@google/genai` | Gemini API 호출 |
| `axios` | FastAPI HTTP 요청 |
| `dotenv` | 환경변수 로드 |
