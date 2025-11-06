# 여행 개인화 앱 - Claude 개발 가이드

이 문서는 AI 어시스턴트(Claude)가 프로젝트를 이해하고 효율적으로 개발을 지원하기 위한 가이드입니다.

## 프로젝트 아키텍처

### 전체 구조

```
travel-app/
├── client/          # React + TypeScript + Vite 프론트엔드
├── server/          # Express + TypeScript 백엔드
└── shared/          # 공통 타입 정의
```

### 핵심 기술 스택

**프론트엔드**
- React 18 + TypeScript
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- React Query (서버 상태 관리)
- Zustand (클라이언트 상태 관리)
- React Router v6 (라우팅)

**백엔드**
- Node.js + Express + TypeScript
- PostgreSQL (메인 데이터베이스)
- Redis (캐싱 및 세션)

**외부 API**
- Google Maps JavaScript API
- Google Places API
- 공공데이터포털 API (버스, 지하철, 기차)
- 카카오 로컬 API (맛집, 관광지)
- OpenWeather API (날씨)

## 코딩 컨벤션

### TypeScript

1. **타입 정의**
   - `any` 사용 최소화
   - 인터페이스는 `I` 접두사 없이 명명 (예: `User`, `TravelRoute`)
   - 타입은 PascalCase 사용
   - enum은 PascalCase로 명명

2. **파일 구조**
   ```typescript
   // 1. Import 문
   import React from 'react'
   import { SomeType } from '@types/...'

   // 2. 타입/인터페이스 정의
   interface Props {
     // ...
   }

   // 3. 컴포넌트/함수 정의
   export const Component: React.FC<Props> = () => {
     // ...
   }
   ```

3. **네이밍 컨벤션**
   - 컴포넌트: PascalCase (예: `SearchForm`, `RouteTimeline`)
   - 함수/변수: camelCase (예: `fetchRoutes`, `userPreferences`)
   - 상수: UPPER_SNAKE_CASE (예: `API_BASE_URL`)
   - 타입/인터페이스: PascalCase (예: `RouteData`, `UserPreference`)

### React 컴포넌트

1. **함수형 컴포넌트 사용**
   ```typescript
   export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
     // 컴포넌트 로직
     return <div>...</div>
   }
   ```

2. **커스텀 훅 활용**
   - 재사용 가능한 로직은 커스텀 훅으로 추출
   - 훅 이름은 `use` 접두사 사용 (예: `useRouteSearch`, `useGoogleMaps`)

3. **컴포넌트 분리 원칙**
   - 하나의 컴포넌트는 하나의 책임만
   - 200줄 이상의 컴포넌트는 분리 검토
   - UI 컴포넌트와 컨테이너 컴포넌트 분리

### API 통신

1. **React Query 패턴**
   ```typescript
   // services/routeService.ts
   export const routeService = {
     getRoutes: async (params: RouteParams) => {
       const { data } = await axios.get('/api/routes', { params })
       return data
     }
   }

   // hooks/useRoutes.ts
   export const useRoutes = (params: RouteParams) => {
     return useQuery({
       queryKey: ['routes', params],
       queryFn: () => routeService.getRoutes(params),
     })
   }
   ```

2. **에러 핸들링**
   - try-catch 블록 사용
   - 사용자 친화적인 에러 메시지 제공
   - 에러 로깅

### 상태 관리

1. **Zustand 스토어 패턴**
   ```typescript
   interface StoreState {
     data: SomeData
     setData: (data: SomeData) => void
   }

   export const useStore = create<StoreState>((set) => ({
     data: initialData,
     setData: (data) => set({ data }),
   }))
   ```

2. **상태 관리 원칙**
   - 서버 상태: React Query
   - 클라이언트 전역 상태: Zustand
   - 컴포넌트 로컬 상태: useState

## API 설계 원칙

### RESTful API 규칙

```
GET    /api/routes              # 경로 목록 조회
POST   /api/routes              # 경로 생성
GET    /api/routes/:id          # 특정 경로 조회
PUT    /api/routes/:id          # 경로 수정
DELETE /api/routes/:id          # 경로 삭제

GET    /api/places/restaurants  # 맛집 추천
GET    /api/places/attractions  # 관광지 추천
GET    /api/places/hotels       # 숙소 추천

GET    /api/transport/bus       # 버스 정보
GET    /api/transport/subway    # 지하철 정보
GET    /api/transport/train     # 기차 정보

GET    /api/weather             # 날씨 정보
```

### 응답 형식

**성공 응답**
```typescript
{
  success: true,
  data: {
    // 실제 데이터
  },
  meta?: {
    // 페이지네이션 등 메타 정보
  }
}
```

**에러 응답**
```typescript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: '사용자 친화적 메시지',
    details?: any
  }
}
```

## 데이터베이스 스키마 (예상)

### Users (사용자)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Travel Plans (여행 계획)
```sql
CREATE TABLE travel_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  departure_time TIMESTAMP,
  duration INTEGER, -- 여행 기간 (일)
  preferences JSONB, -- 음식, 관광 스타일, 예산 등
  route_data JSONB, -- 선택된 경로 정보
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Saved Places (저장된 장소)
```sql
CREATE TABLE saved_places (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  place_id VARCHAR(255), -- Google Place ID
  name VARCHAR(255),
  category VARCHAR(50), -- restaurant, attraction, hotel
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 주요 기능 구현 가이드

### 1. 실시간 대중교통 정보

**구현 위치**: `server/src/services/transportService.ts`

```typescript
// 버스 정보 조회
export const getBusArrival = async (stationId: string) => {
  // 공공데이터포털 API 호출
  // Redis 캐싱 (1분)
  // 데이터 정규화 후 반환
}

// 지하철 정보 조회
export const getSubwayRealtime = async (stationName: string) => {
  // 공공데이터포털 API 호출
  // Redis 캐싱 (30초)
  // 데이터 정규화 후 반환
}
```

**캐싱 전략**
- 버스 도착 정보: 1분 TTL
- 지하철 실시간 정보: 30초 TTL
- 기차 시간표: 1시간 TTL

### 2. Google Maps 통합

**구현 위치**: `client/src/hooks/useGoogleMaps.ts`

```typescript
export const useGoogleMaps = (containerId: string) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    })

    loader.load().then(() => {
      const mapInstance = new google.maps.Map(
        document.getElementById(containerId)!,
        {
          center: { lat: 37.5665, lng: 126.9780 }, // 서울
          zoom: 12,
        }
      )
      setMap(mapInstance)
    })
  }, [containerId])

  return { map }
}
```

### 3. 장소 추천 시스템

**구현 위치**: `server/src/services/recommendationService.ts`

**추천 알고리즘**
1. 경로 상 반경 내 장소 검색 (Kakao/Google API)
2. 사용자 취향 필터링
3. 평점 및 리뷰 수 기반 정렬
4. 계절/날씨 고려 조정
5. 최종 추천 목록 반환

### 4. 비용 계산

**구현 위치**: `client/src/utils/costCalculator.ts`

```typescript
export const calculateTotalCost = (route: Route) => {
  const transportCost = calculateTransportCost(route.segments)
  const accommodationCost = estimateAccommodation(route.duration, route.preferences)
  const foodCost = estimateFoodCost(route.duration, route.preferences)
  const attractionCost = estimateAttractionCost(route.attractions)

  return {
    transport: transportCost,
    accommodation: accommodationCost,
    food: foodCost,
    attraction: attractionCost,
    total: transportCost + accommodationCost + foodCost + attractionCost
  }
}
```

## 환경 변수 관리

### 클라이언트 (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_key
```

### 서버 (.env)
```bash
# 서버 설정
PORT=5000
NODE_ENV=development

# 데이터베이스
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://localhost:6379

# API 키들
GOOGLE_MAPS_API_KEY=...
KAKAO_REST_API_KEY=...
PUBLIC_DATA_API_KEY=...
OPENWEATHER_API_KEY=...
```

## 테스트 전략

1. **단위 테스트**
   - 유틸리티 함수
   - 순수 함수
   - 비즈니스 로직

2. **통합 테스트**
   - API 엔드포인트
   - 데이터베이스 연동

3. **E2E 테스트**
   - 주요 사용자 플로우
   - 경로 검색 및 추천

## 성능 최적화

1. **프론트엔드**
   - 코드 스플리팅 (React.lazy)
   - 이미지 최적화
   - 메모이제이션 (useMemo, useCallback)
   - Virtual Scrolling (긴 리스트)

2. **백엔드**
   - Redis 캐싱
   - 데이터베이스 인덱싱
   - API 요청 배칭
   - Rate Limiting

3. **외부 API**
   - 요청 캐싱
   - Debouncing (자동완성)
   - 병렬 요청 최적화

## 보안 고려사항

1. **API 키 보호**
   - 환경 변수 사용
   - .gitignore에 .env 포함
   - 클라이언트 측 키는 도메인 제한

2. **입력 검증**
   - Joi를 사용한 서버 측 검증
   - XSS 방지
   - SQL Injection 방지

3. **Rate Limiting**
   - express-rate-limit 사용
   - API 엔드포인트별 제한

## 개발 워크플로우

### 1. 새 기능 개발

1. 기능 브랜치 생성
   ```bash
   git checkout -b feature/feature-name
   ```

2. 타입 정의 (shared/types 또는 각 모듈의 types)

3. 백엔드 API 개발
   - 라우트 추가
   - 컨트롤러 구현
   - 서비스 로직 작성
   - 테스트

4. 프론트엔드 개발
   - API 서비스 함수 작성
   - React Query 훅 생성
   - UI 컴포넌트 구현
   - 스타일링

5. 테스트 및 리뷰

### 2. 디버깅

- 클라이언트: React DevTools, Network 탭
- 서버: VS Code Debugger, 로그
- 데이터베이스: pgAdmin, SQL 쿼리

## 주요 명령어

### 개발 시작
```bash
# 터미널 1 - 서버
cd server && npm run dev

# 터미널 2 - 클라이언트
cd client && npm run dev

# 터미널 3 - PostgreSQL (필요시)
brew services start postgresql

# 터미널 4 - Redis (필요시)
redis-server
```

### 빌드 및 배포
```bash
# 클라이언트 빌드
cd client && npm run build

# 서버 빌드
cd server && npm run build

# 프로덕션 실행
cd server && npm start
```

## 트러블슈팅

### 자주 발생하는 문제

1. **CORS 에러**
   - 서버의 cors 설정 확인
   - 프론트엔드 프록시 설정 확인

2. **API 키 에러**
   - .env 파일 존재 여부 확인
   - 환경 변수 로드 확인
   - API 키 유효성 확인

3. **PostgreSQL 연결 오류**
   - 데이터베이스 실행 상태 확인
   - DATABASE_URL 확인
   - 권한 확인

4. **Redis 연결 오류**
   - Redis 서버 실행 확인
   - REDIS_URL 확인

## 다음 단계 개발 로드맵

### Phase 1: 기본 기능 (현재)
- [x] 프로젝트 초기 설정
- [ ] 사용자 입력 폼 (출발지, 도착지, 시간)
- [ ] Google Maps 통합
- [ ] 기본 경로 검색

### Phase 2: 대중교통 통합
- [ ] 버스 실시간 정보
- [ ] 지하철 실시간 정보
- [ ] 기차/KTX 시간표
- [ ] 경로 시각화 (타임라인)

### Phase 3: 추천 시스템
- [ ] 맛집 추천
- [ ] 관광지 추천
- [ ] 숙소 추천
- [ ] 사용자 취향 입력 UI

### Phase 4: 최적화 및 고도화
- [ ] 비용 계산 및 분석
- [ ] 경로 최적화 알고리즘
- [ ] 사용자 인증
- [ ] 여행 계획 저장

### Phase 5: 배포 및 운영
- [ ] 프로덕션 빌드
- [ ] 성능 최적화
- [ ] 모니터링 설정
- [ ] CI/CD 파이프라인

## 참고 자료

- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
- [React Query 문서](https://tanstack.com/query/latest)
- [Google Maps JavaScript API 문서](https://developers.google.com/maps/documentation/javascript)
- [공공데이터포털](https://www.data.go.kr/)
- [Kakao Developers](https://developers.kakao.com/)

---

이 가이드는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.
