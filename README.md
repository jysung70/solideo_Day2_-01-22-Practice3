# 여행 개인화 앱 (Travel Personalization App)

실시간 대중교통 정보와 개인 취향을 결합한 통합 여행 계획 서비스

## 프로젝트 개요

여행 개인화 앱은 사용자의 출발지와 도착지를 기반으로 실시간 대중교통 정보를 제공하고, 개인의 취향에 맞는 맛집, 관광지, 숙소를 추천하는 웹 애플리케이션입니다.

## 주요 기능

### 1. 기본 정보 입력
- 출발지/도착지 주소 입력 (자동완성 지원)
- 출발 시간 및 여행 기간 설정

### 2. 실시간 대중교통 연계
- 버스 실시간 도착 정보
- 지하철 실시간 운행 정보
- 기차/KTX 시간표
- 경로 시각화 (타임라인 형태)
- 환승 정보 하이라이트

### 3. 개인 취향 기반 추천
- 사용자 취향 분석 (음식, 관광 스타일, 예산)
- 경로 상 맛집 추천
- 관광지 추천 (계절, 날씨 고려)
- 숙소 추천

### 4. 구글 맵스 통합
- 지도 기반 경로 시각화
- 추천 장소 핀 표시
- 상세 정보 제공

### 5. 비용 분석
- 교통비 계산
- 숙박비/식비 추정
- 총 예상 비용 제시
- 최소 비용 옵션 제공

### 6. 경로 최적화
- 최단 시간 경로
- 최소 비용 경로
- 최소 환승 경로
- 균형 잡힌 추천 경로

## 기술 스택

### 프론트엔드
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router v6

### 백엔드
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis

### 외부 API
- Google Maps JavaScript API
- Google Places API
- 공공데이터포털 대중교통 API
- 카카오 로컬 API
- OpenWeather API

## 프로젝트 구조

```
travel-app/
├── client/                  # 프론트엔드
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── pages/          # 페이지
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── services/       # API 서비스
│   │   ├── store/          # 상태 관리 (Zustand)
│   │   ├── types/          # TypeScript 타입
│   │   └── utils/          # 유틸리티 함수
│   └── package.json
│
├── server/                  # 백엔드
│   ├── src/
│   │   ├── routes/         # API 라우트
│   │   ├── controllers/    # 컨트롤러
│   │   ├── services/       # 비즈니스 로직
│   │   ├── models/         # 데이터 모델
│   │   ├── middleware/     # 미들웨어
│   │   └── types/          # TypeScript 타입
│   └── package.json
│
└── shared/                  # 공통 타입/유틸
    └── types/
```

## 시작하기

### 필수 요구사항

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- npm 또는 yarn

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd travel-app
```

2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 열어 필요한 API 키를 입력하세요
```

3. 클라이언트 의존성 설치 및 실행
```bash
cd client
npm install
npm run dev
```

4. 서버 의존성 설치 및 실행 (새 터미널)
```bash
cd server
npm install
npm run dev
```

### 개발 서버

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000

## API 키 발급 가이드

### Google APIs
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. Maps JavaScript API 및 Places API 활성화
4. API 키 생성 및 복사

### 카카오 API
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 추가
3. REST API 키 발급

### 공공데이터포털
1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 및 로그인
3. 필요한 API 신청 (버스 도착 정보, 지하철 실시간 정보 등)

### OpenWeather API
1. [OpenWeather](https://openweathermap.org/api) 접속
2. 회원가입 및 API 키 발급

## 개발 명령어

### 클라이언트
```bash
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 실행
npm run format   # Prettier 실행
```

### 서버
```bash
npm run dev      # 개발 서버 시작 (watch 모드)
npm run build    # TypeScript 컴파일
npm start        # 프로덕션 서버 시작
npm run lint     # ESLint 실행
npm run format   # Prettier 실행
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해 주세요.

---

더 자세한 개발 가이드는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.
