# SlimHealth - Node.js AI 파이프라인

Gemini API를 활용한 OCR 분석 및 건강 조언 생성 모듈입니다.

---

## 파일 구조

```
Proxy/Api/
├── geminiClient.mjs   # Gemini API 키 로테이션 공통 모듈
├── ocr.mjs            # 건강검진 이미지 → 수치 JSON 추출
└── healthAdvice.mjs   # 현재 수치 + 예측 수치 → 건강 조언 생성
```

---

## 환경 설정

### 패키지 설치

```bash
npm install @google/genai axios dotenv
```

### `.env` 파일 설정

```env
GEMINI_API_KEY_1=your_key_1
GEMINI_API_KEY_2=your_key_2
GEMINI_API_KEY_3=your_key_3
GEMINI_API_KEY_4=your_key_4
```

> 키는 1개만 있어도 동작하며 최대 4개까지 등록 가능합니다.
> 429(Rate Limit) 또는 503(Unavailable) 오류 발생 시 자동으로 다음 키로 전환됩니다.

---

## 모듈 상세

---

### `geminiClient.mjs` — Gemini API 공통 클라이언트

모든 모듈에서 import하여 사용하는 공통 유틸리티입니다.

#### 제공 함수

| 함수 | 설명 |
|------|------|
| `getAI()` | 현재 활성 키로 GoogleGenAI 인스턴스 반환 |
| `rotateKey(errorMsg)` | 오류 메시지 기반 API 키 자동 교체 |
| `retryOnError(fn, label)` | 오류 시 최대 3회 재시도 (키 로테이션 포함) |

#### 재시도 전략

| 오류 유형 | 대기 시간 |
|----------|----------|
| 키 교체 성공 | 1초 |
| 429 Rate Limit | 10초 |
| 503 Unavailable | 5초 |

---

### `ocr.mjs` — 건강검진 이미지 OCR

건강검진 이미지(또는 PDF)를 Gemini Vision으로 분석하여 수치를 JSON으로 추출합니다.

#### 지원 파일 형식

`png`, `jpg`, `jpeg`, `webp`, `gif`, `bmp`, `pdf`

#### 제공 함수

**`runOCR(fileNames)`**

```javascript
import { runOCR } from './ocr.mjs';

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
|------|------|
| `gender` | 성별 (1: 남성, 2: 여성) |
| `age` | 검진 기준 만 나이 |
| `height` | 키 (cm) |
| `weight` | 체중 (kg) |
| `waist` | 허리둘레 (cm) |
| `sbp` / `dbp` | 수축기 / 이완기 혈압 (mmHg) |
| `bs` | 공복혈당 (mg/dL) |
| `tg` | 중성지방 (mg/dL) |
| `hdl` | HDL 콜레스테롤 (mg/dL) |

> HDL은 LDL, 총콜레스테롤과 혼동하지 않도록 프롬프트에 명시적 주의사항이 포함되어 있습니다.

---

**`validateOCR(ocr)`**

OCR 결과가 정상 범위인지 검사합니다.

```javascript
import { validateOCR } from './ocr.mjs';
const isValid = validateOCR(ocrResult); // true / false
```

| 항목 | 정상 범위 |
|------|----------|
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
import { getAgeCode } from './ocr.mjs';
const code = getAgeCode(42); // → 9
```

| 나이 | age_code |
|------|----------|
| 25 ~ 34세 | 7 |
| 35 ~ 39세 | 8 |
| 40 ~ 44세 | 9 |
| 45 ~ 49세 | 10 |
| 50 ~ 54세 | 11 |
| 55 ~ 59세 | 12 |
| 25세 미만 / 60세 이상 | `null` (서비스 대상 외) |

---

### `healthAdvice.mjs` — Gemini 건강 조언 생성

현재 수치와 감량별 예측 수치를 분석하여 맞춤형 건강 조언 JSON을 생성합니다.

#### 함수

**`getHealthAdvice(ocrResult, userInput, currentMetrics, allPredictions)`**

```javascript
import { getHealthAdvice } from './healthAdvice.mjs';

const advice = await getHealthAdvice(ocrResult, userInput, currentMetrics, predictions);
```

| 파라미터 | 설명 |
|----------|------|
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
      "message": "현재 기준에 근접한 수치입니다. 복부 비만 관리가 필요합니다."
    }
  ],
  "lifestyle_tips": {
    "diet": "...",
    "exercise": "...",
    "habit": "..."
  },
  "total_advice": [
    "대사증후군 위험 항목 현황 및 주요 수치 설명...",
    "허리둘레·혈압 위험 원인 및 개선 행동...",
    "혈당·중성지방·HDL 위험 원인 및 개선 행동...",
    "식단 구체 조언...",
    "운동 구체 조언...",
    "생활습관 구체 조언...",
    "추천 감량량 달성 시 기대 효과 및 격려...",
    "본 내용은 AI 기반 건강 정보 제공으로 의학적 진단을 대체하지 않습니다. 정확한 진단과 치료는 반드시 전문의와 상담하세요."
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `overall_summary` | `string` | 전체 건강 상태 한 줄 요약 (30자 이내) |
| `risk_level` | `string` | `"정상"` / `"주의"` / `"위험"` |
| `syndrome_count` | `number` | 대사증후군 해당 항목 수 (5개 중) |
| `recommended_loss_kg` | `number` | 지표 정상화를 위한 최소 권장 감량 (kg) |
| `recommended_reason` | `string` | 추천 감량량 선정 이유 |
| `advices` | `object[]` | 지표별 상태 및 조언 배열 |
| `lifestyle_tips` | `object` | 식단 / 운동 / 생활습관 각 2문장 |
| `total_advice` | `string[]` | 통합 종합 조언 배열 (8개 항목, 2000자 수준) |

#### risk_level 판정 기준

| syndrome_count | risk_level |
|---------------|-----------|
| 0개 | `"정상"` |
| 1 ~ 2개 | `"주의"` |
| 3개 이상 | `"위험"` (대사증후군 해당) |

#### total_advice 배열 구성 (8개 항목)

| 인덱스 | 내용 |
|--------|------|
| 0 | 현재 대사증후군 위험 항목 수 및 주요 수치 현황 |
| 1 | 허리둘레·혈압 위험 원인 + 개선 행동 (흡연/음주 반영) |
| 2 | 혈당·중성지방·HDL 위험 원인 + 개선 행동 |
| 3 | 식단 구체 조언 (lifestyle_tips diet 확장) |
| 4 | 운동 구체 조언 (lifestyle_tips exercise 확장) |
| 5 | 생활습관 구체 조언 (lifestyle_tips habit 확장) |
| 6 | 추천 감량량 달성 시 대사증후군 항목 변화 예측 + 격려 |
| 7 | 고정 면책 문구 |

---

## DB 캐싱

`healthRouter.js`의 `GET /api/health/advice/:physical_idx` 엔드포인트는 Gemini 조언을 최초 1회 생성 후 `tbl_physical.advice_json` 컬럼에 저장합니다.

이후 동일한 `physical_idx`로 요청 시 Gemini를 재호출하지 않고 DB에서 즉시 반환합니다.

```
최초 요청 → Gemini 호출 → advice_json DB 저장 → 반환
재요청    → DB에서 즉시 반환 (Gemini 미호출)
```

> 건강 데이터 수정(`PUT /api/health/update/:physical_idx`) 시 `advice_json = NULL` 로 초기화되어 다음 조회 시 재생성됩니다.

---

## 전체 연동 흐름

```
프론트엔드
    │ 건강검진 이미지 업로드 + 흡연/음주 입력
    ▼
Node.js (healthRouter.js)
    │
    ├─ [1] ocr.mjs          → Gemini Vision으로 이미지 분석
    ├─ [2] FastAPI           → XGBoost 예측 (http://localhost:8081/predict-all)
    ├─ [3] DB 저장           → tbl_physical, tbl_analysis
    └─ [4] healthAdvice.mjs  → Gemini로 맞춤 건강 조언 생성 + DB 캐싱
    │
    ▼ 최종 JSON (predictions + advice)
프론트엔드
```

---

## 에러 처리

| 오류 | 원인 | 해결 방법 |
|------|------|----------|
| `ECONNREFUSED` | FastAPI 서버 미실행 | Python FastAPI 서버 먼저 실행 |
| `503 Unavailable` | Gemini 서버 과부하 | 잠시 후 재요청 (자동 재시도 3회) |
| `서비스 대상 아님` | 나이 범위 초과 | 25 ~ 59세만 서비스 가능 |
| `분석할 파일이 없습니다` | 파일 경로 오류 | `fileNames` 배열의 파일명 확인 |

---

## 의존성

| 패키지 | 용도 |
|--------|------|
| `@google/genai` | Gemini API 호출 |
| `axios` | FastAPI HTTP 요청 |
| `dotenv` | 환경변수 로드 |
