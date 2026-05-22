# SlimHealth
체중기반 5대지표 변화 예측 서비스 및 플랫폼 


진행상황 및 WBS 공유엑셀
https://docs.google.com/spreadsheets/d/15y0EjhsAFS_GMEWxSQYgrk3hHAMOhj3dBwFgnm7xwzc/edit?gid=190180753#gid=190180753

산출문서 저장 및 공유 링크
https://drive.google.com/drive/folders/1QGz26lRuezdU6x7X2L8T6Nrq9FRxd4vZ
# SlimHealth

체중기반 5대지표 변화 예측 서비스 및 플랫폼

# 소개

사용자는 자신의 건강 데이터를 입력하면
▶ 현재 건강 상태 분석
▶ 대사 증후군 위험 여부 판단
▶ 체중 감량 목표제안
▶ 감량후 예상 변화 시뮬레이션
▶ 건겅 리포트 생성

# 주요 분석 지표

허리 둘래            복부 비만 여부 판단
혈압                 고혈압 위험도
공복혈당             당뇨 위험도
중성지방(TG)         대사 이상 여부
HOL콜레스테롤        좋은 콜레스테롤 수치

# 대사 증후군 판정기준

▶ 남성 기준
허리둘레 =>90cm
혈압=> 130/85
공복혈당=>100
중성지방=>150
HDL<40
▶여성 기준
허리둘레 =>85cm
혈압=> 130/85
공복혈당=>100
중성지방=>150
HDL<50
※5개항목 중 3개 이상 해당 시 대사증후군 위험군 판단

# 주요 기능

1.건강검진 OCR업로드
2.건강 위험도 분석
3.체중 감량 시뮬레이션
감량 목표                  예상 변화
-3kg                   혈압감소 가능성
-5kg                   혈당 개선 가능성
-7kg                   대사증후군 위험감소
-10kg                  지방간/당뇨 위험도 감소
[4.AI](http://4.ai/) 건강 리포트 생성
5.관리자 대시보드

# 시스템 아키 텍쳐

[ Frontend ]
React + TypeScript + TailwindCSS

```
    ↓ API 요청
```

[ Backend ]
Node.js + Express

```
    ↓
```

[ AI / ML ]
Python
Scikit-learn
XGBoost
Pandas

```
    ↓
```

[ Database ]
MySQL

```
    ↓
```

[ OCR ]
Google Vision API / Tesseract OCR

## 기술 스텍

#FRONT END
▶ React
▶ TypeScript
▶ TailwindCSS
▶ ReactQuery
▶ Rechart
#BACKEND
▶ Node.js
▶ Express
▶ JWT 인증
▶ Argon2 암호화
#AI/DATA
▶ Python
▶ Pandas
▶ Numpy
▶ Scikit-learn
▶ XGBoost
#DATA BASE
▶MySQL

## 프로젝트 구조

SlimHealth/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── models/
│
├── ai/
│   ├── dataset/
│   ├── preprocessing/
│   ├── training/
│   └── prediction/
│
├── docs/
│
└── [README.md](http://readme.md/)

# 데이터 셋

▶국민건강보험공단 건강 검진 데이터
▶사용자 입력 데이터
#AI모델
모델                       목적
LogisticRegressin        위험도 분류
Random Forest            건강 상태 예측
XGBoost                  체중 감량효과 예측
#보안
▶JWT기반 인증
▶Argon2 비밀번호 암호화
▶개인정보최소저장
▶HTTP 통신예정

# 향후 개발 계획

▶모바일 앱 출시
▶실시간 건강코칭
▶식단추천 AI
▶운동추천 AI
▶ChatBot 건강 상담 가능
