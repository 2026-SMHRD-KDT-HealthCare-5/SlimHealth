# SlimHealth Proxy Server

SlimHealth의 `Proxy` 폴더는 React 프론트엔드와 Python FastAPI 모델 서버, MySQL 데이터베이스, Gemini API를 연결하는 Node.js/Express 기반 백엔드 중계 서버입니다.

프론트엔드에서 들어온 요청을 받아 사용자 인증, 건강검진 데이터 저장, 체중 감량 시나리오 예측 요청, OCR 처리, AI 건강 조언 생성을 담당합니다.

## 주요 역할

- React 프론트엔드 API 요청 수신
- JWT 기반 로그인/인증 처리
- Argon2 기반 비밀번호 해시 저장
- MySQL 사용자/검진/예측 데이터 CRUD
- FastAPI `/predict-all` 호출을 통한 XGBoost 예측 결과 연동
- Gemini 기반 OCR 및 건강 조언 생성
- 건강 데이터 수정 시 기존 예측 결과 삭제 후 재예측

## 기술 스택

| 구분 | 기술 |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MySQL, mysql2 |
| Auth | JWT, Argon2 |
| AI/OCR | Gemini API, `@google/genai` |
| Model Server 연동 | Axios, FastAPI |
| File Upload | Multer |
| CORS | cors |

## 폴더 구조

```text
Proxy/
├─ main.js                    # Express 서버 진입점
├─ package.json               # Node 패키지 및 실행 스크립트
├─ Router/
│  ├─ authRouter.js           # 로그인, 토큰 재발급, 로그아웃
│  ├─ userRouter.js           # 회원가입, 회원정보 수정/삭제, 아이디 중복 확인
│  ├─ healthRouter.js         # 건강 데이터 저장/조회/수정/삭제, 예측, AI 조언
│  └─ ocrRouter.js            # 검진표 파일 업로드 및 OCR 처리
├─ Api/
│  ├─ geminiClient.mjs        # Gemini API 클라이언트 및 키 로테이션
│  ├─ ocr.mjs                 # 건강검진 OCR 추출/검증
│  └─ healthAdvice.mjs        # AI 건강 조언 생성
├─ config/
│  ├─ database.js             # MySQL 연결 설정
│  └─ pythonFastAPI.js        # Python FastAPI 서버 주소 설정
└─ middleware/
   └─ authRequired.js         # JWT 인증 미들웨어
```

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`Proxy/.env` 파일을 생성하고 아래 값을 설정합니다.

```env
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

GEMINI_API_KEY_1=your_gemini_api_key
GEMINI_API_KEY_2=optional_second_key
GEMINI_API_KEY_3=optional_third_key
GEMINI_API_KEY_4=optional_fourth_key
```

> 주의: DB 계정, JWT 시크릿, Gemini API Key 같은 민감 정보는 Git에 올리지 않습니다.

### 3. FastAPI 서버 실행

Proxy 서버의 예측 기능은 Python FastAPI 서버가 먼저 실행되어 있어야 합니다.

```bash
cd ../Python/Server
python FastAPI.py
```

기본 FastAPI 주소:

```text
http://localhost:8081
```

### 4. Proxy 서버 실행

```bash
cd Proxy
npm start
```

기본 Express 서버 주소:

```text
http://localhost:8000
```

프론트엔드 CORS 허용 주소:

```text
http://localhost:5173
```

## API 라우터

### Auth Router

Base URL:

```text
/api/auth
```

| Method | URL | 설명 |
|---|---|---|
| POST | `/login` | 사용자 로그인, Access Token/Refresh Token 발급 |
| POST | `/refresh` | Refresh Token 검증 후 Access Token 재발급 |
| POST | `/logout` | 로그아웃 응답 반환 |

### User Router

Base URL:

```text
/api/user
```

| Method | URL | 설명 |
|---|---|---|
| POST | `/create` | 회원가입 및 비밀번호 해시 저장 |
| POST | `/update` | 회원정보 수정, JWT 인증 필요 |
| POST | `/delete` | 회원 탈퇴, JWT 인증 필요 |
| POST | `/check` | 아이디 중복 확인 |

### Health Router

Base URL:

```text
/api/health
```

`/api/health` 라우터는 `authRequired` 미들웨어가 적용되어 Access Token이 필요합니다.

| Method | URL | 설명 |
|---|---|---|
| POST | `/create` | 건강검진 데이터 저장 후 FastAPI 예측 호출, 예측 결과 DB 저장 |
| POST | `/list` | 로그인 사용자의 건강검진 기록 목록 조회 |
| GET | `/predict/:physical_idx` | 특정 검진 기록과 감량 예측 결과 조회 |
| POST | `/update/:physical_idx` | 건강검진 데이터 수정 후 기존 예측 삭제 및 재예측 |
| DELETE | `/delete/:physical_idx` | 건강검진 기록 삭제 |
| GET | `/advice/:physical_idx` | Gemini 기반 건강 조언 생성 또는 저장된 조언 반환 |

### OCR Router

Base URL:

```text
/api/ocr
```

| Method | URL | 설명 |
|---|---|---|
| POST | `/` | 건강검진 파일 업로드 후 OCR 결과 반환 |

파일 업로드 필드명:

```text
files
```

최대 업로드 개수:

```text
5개
```

## 주요 데이터 흐름

### 건강 데이터 저장 및 예측

```text
React DataInput
  ↓ POST /api/health/create
Express healthRouter
  ↓ tbl_physical 저장
MySQL
  ↓ 사용자 생년월일/성별 조회 및 age_code, BMI 계산
FastAPI /predict-all
  ↓ kg별 예측 결과 반환
Express healthRouter
  ↓ tbl_analysis에 감량 kg별 예측 결과 저장
React Prediction
```

### 건강 조언 생성

```text
React Prediction
  ↓ GET /api/health/advice/:physical_idx
Express healthRouter
  ↓ tbl_physical + tbl_analysis 조회
Gemini healthAdvice.mjs
  ↓ 위험 단계, 추천 감량량, 생활습관 조언 생성
MySQL advice_json 저장
  ↓
React에 AI 건강 리포트 반환
```

### OCR 처리

```text
React 파일 업로드
  ↓ POST /api/ocr
Multer 파일 저장
  ↓
ocr.mjs runOCR()
  ↓ Gemini Vision 기반 건강검진 수치 추출
validateOCR()
  ↓
React에 OCR 결과 반환
```

## 인증 방식

로그인 성공 시 서버는 다음 토큰을 반환합니다.

- `accessToken`: API 요청 인증용
- `refreshToken`: Access Token 재발급용

인증이 필요한 요청은 HTTP Header에 Bearer Token을 포함해야 합니다.

```http
Authorization: Bearer <accessToken>
```

`authRequired.js`는 토큰을 검증한 뒤 `req.user`에 사용자 정보를 저장합니다.

## FastAPI 연동

FastAPI 주소는 `config/pythonFastAPI.js`에서 관리합니다.

```javascript
const PYTHON_SERVER_BASE = "http://localhost:8081";
```

Proxy에서 호출하는 주요 FastAPI 엔드포인트:

```text
POST http://localhost:8081/predict-all
```

전송 데이터에는 성별, 나이 코드, 키, 체중, 허리둘레, 혈압, 공복혈당, 중성지방, HDL, 흡연/음주 여부 등이 포함됩니다.

## 데이터베이스 연동

`config/database.js`에서 `mysql2` 기반 Promise 연결을 생성합니다.

주요 테이블:

| 테이블 | 설명 |
|---|---|
| `tbl_user` | 사용자 계정 정보 |
| `tbl_physical` | 사용자 건강검진 원본 데이터 |
| `tbl_analysis` | 감량 kg별 예측 결과 |

관계:

```text
tbl_user 1 : N tbl_physical
tbl_physical 1 : N tbl_analysis
```

## 담당 구현 포인트

Proxy 파트의 핵심 구현 포인트는 다음과 같습니다.

- 프론트엔드와 AI/DB 서버 사이의 API 게이트웨이 역할
- JWT 인증 미들웨어를 통한 사용자별 건강 데이터 접근 제한
- 건강검진 데이터 저장 직후 FastAPI 예측 서버 호출
- 예측 결과를 kg 단위로 반복 저장하는 DB 연동 로직
- 건강 데이터 수정 시 예측 결과와 AI 조언을 최신 상태로 갱신
- OCR과 Gemini 건강 조언 기능을 Express 라우터에 연결

## 실행 전 체크리스트

- MySQL 연결 정보가 올바른지 확인
- `.env`에 JWT Secret과 Gemini API Key가 있는지 확인
- Python FastAPI 서버가 `8081` 포트에서 실행 중인지 확인
- React 개발 서버가 `5173` 포트에서 실행 중인지 확인
- Proxy 서버가 `8000` 포트에서 실행 중인지 확인
