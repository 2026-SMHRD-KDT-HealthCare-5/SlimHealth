# SlimHealth React Frontend

SlimHealth의 React 프론트엔드 애플리케이션입니다. 사용자의 건강 데이터를 입력받고, AI 기반 예측 결과와 개선 가이드를 화면에 제공합니다.

## 기술 스택

- React 19
- Vite
- React Router DOM
- Axios
- TanStack React Query
- Recharts / ECharts
- Storybook
- ESLint

## 주요 기능

- 회원가입 및 로그인
- 건강 데이터 입력 및 수정
- 건강 데이터 입력 이력 조회
- AI 기반 건강 예측 결과 조회
- 예측 결과 요약, 위험도, 개선 가이드 시각화
- 공통 컴포넌트 기반 UI 구성

## 폴더 구조

```text
Front/React
├─ public/                  # 정적 파일
├─ src/
│  ├─ api/                  # API 요청 모듈 및 Axios 설정
│  ├─ assets/               # 이미지, 아이콘 등 정적 리소스
│  ├─ components/           # 재사용 공통 컴포넌트
│  ├─ context/              # React Context 정의
│  ├─ features/             # 기능 단위 UI 및 로직
│  ├─ pages/                # 라우트 페이지 컴포넌트
│  ├─ provider/             # 전역 Provider
│  ├─ stories/              # Storybook 예제
│  ├─ utils/                # 공통 유틸 함수
│  ├─ App.jsx               # 라우팅 및 전역 UI 구성
|  ├─ index.css             # 공통 css 작성
│  └─ main.jsx              # 앱 진입점
├─ .env                     # 환경 변수
├─ package.json             # 프로젝트 의존성 및 스크립트
└─ vite.config.js           # Vite 설정
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`Front/React/.env` 파일에 API 서버 주소를 설정합니다.

```env
VITE_API_URL=http://localhost:8000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

기본적으로 Vite 개발 서버가 실행되며, 터미널에 표시되는 로컬 주소로 접속할 수 있습니다.

## 사용 가능한 스크립트

```bash
npm run dev
```

개발 서버를 실행합니다.

```bash
npm run build
```

프로덕션 빌드를 생성합니다.

```bash
npm run preview
```

빌드 결과물을 로컬에서 미리 확인합니다.

```bash
npm run lint
```

ESLint로 코드 스타일과 잠재적인 오류를 검사합니다.

```bash
npm run storybook
```

Storybook을 실행하여 공통 컴포넌트를 독립적으로 확인합니다.

```bash
npm run build-storybook
```

Storybook 정적 빌드를 생성합니다.

```bash
npm run generate
```

Plop 템플릿을 이용해 컴포넌트 등의 파일을 생성합니다.

## 라우팅

주요 라우트는 `src/App.jsx`에서 관리합니다.

| 경로                | 설명                         |
| ------------------- | ---------------------------- |
| `/`                 | 메인 페이지                  |
| `/login`            | 로그인 페이지                |
| `/join`             | 회원가입 페이지              |
| `/dataInput`        | 건강 데이터 입력 페이지      |
| `/dataUpdate`       | 건강 데이터 수정 페이지      |
| `/prediction`       | 건강 예측 결과 페이지        |
| `/dataInputHistory` | 건강 데이터 입력 이력 페이지 |

## API 연동

API 요청은 `src/api` 폴더에서 관리합니다.

- `axios.js`: Axios 인스턴스, 인증 토큰 설정, 토큰 재발급 처리
- `userApi.js`: 사용자 인증 관련 API
- `healthDataApi.js`: 건강 데이터 관련 API

API 기본 주소는 `.env`의 `VITE_API_URL` 값을 사용합니다.

## 컴포넌트 개발 규칙

공통 UI는 `src/components` 아래에 컴포넌트 단위 폴더로 관리합니다.

권장 구조는 다음과 같습니다.

```text
components/ComponentName
├─ ComponentName.jsx
├─ ComponentName.css
├─ ComponentName.stories.jsx
└─ index.js
```

컴포넌트를 추가할 때는 Storybook 파일을 함께 작성하면 UI 상태를 더 쉽게 확인할 수 있습니다.

컴포넌트 하나를 만들 때마다 shell에 아래와 같이 입력하면 자동으로 컴포넌트와 storybook 템플릿이 만들어집니다.

```bash
npm run generate ComponentName
```

## 참고 사항

- 로그인 후 발급받은 토큰은 로컬 스토리지에 저장되어 API 요청 시 Authorization 헤더에 포함됩니다.
- Access Token 만료 시 Refresh Token을 이용해 토큰 재발급을 시도합니다.
- 일부 기존 소스의 한글 주석 또는 문자열이 깨져 보일 수 있으므로, 파일 저장 인코딩은 UTF-8로 통일하는 것을 권장합니다.
