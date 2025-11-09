import { Location } from '@/types'

// 한국 주요 도시 좌표 데이터
export const KOREAN_CITIES: Record<string, Location> = {
  // 서울
  '서울': { address: '서울특별시', lat: 37.5665, lng: 126.9780 },
  '서울역': { address: '서울특별시 용산구 서울역', lat: 37.5546788, lng: 126.9709914 },
  '강남': { address: '서울특별시 강남구', lat: 37.4979, lng: 127.0276 },
  '강남역': { address: '서울특별시 강남구 강남역', lat: 37.4979462, lng: 127.0276368 },
  '홍대': { address: '서울특별시 마포구 홍대입구역', lat: 37.5565, lng: 126.9235 },
  '홍대입구역': { address: '서울특별시 마포구 홍대입구역', lat: 37.5565, lng: 126.9235 },
  '명동': { address: '서울특별시 중구 명동', lat: 37.5636, lng: 126.9826 },
  '잠실': { address: '서울특별시 송파구 잠실', lat: 37.5133, lng: 127.1000 },
  '여의도': { address: '서울특별시 영등포구 여의도', lat: 37.5219, lng: 126.9245 },

  // 경기도
  '인천': { address: '인천광역시', lat: 37.4563, lng: 126.7052 },
  '수원': { address: '경기도 수원시', lat: 37.2636, lng: 127.0286 },
  '성남': { address: '경기도 성남시', lat: 37.4201, lng: 127.1262 },
  '용인': { address: '경기도 용인시', lat: 37.2411, lng: 127.1776 },
  '고양': { address: '경기도 고양시', lat: 37.6584, lng: 126.8320 },
  '부천': { address: '경기도 부천시', lat: 37.5034, lng: 126.7660 },
  '안산': { address: '경기도 안산시', lat: 37.3219, lng: 126.8309 },
  '안양': { address: '경기도 안양시', lat: 37.3943, lng: 126.9568 },
  '평택': { address: '경기도 평택시', lat: 36.9921, lng: 127.1128 },

  // 광역시
  '부산': { address: '부산광역시', lat: 35.1796, lng: 129.0756 },
  '대구': { address: '대구광역시', lat: 35.8714, lng: 128.6014 },
  '대전': { address: '대전광역시', lat: 36.3504, lng: 127.3845 },
  '광주': { address: '광주광역시', lat: 35.1595, lng: 126.8526 },
  '울산': { address: '울산광역시', lat: 35.5384, lng: 129.3114 },
  '세종': { address: '세종특별자치시', lat: 36.4800, lng: 127.2890 },

  // 강원도
  '춘천': { address: '강원도 춘천시', lat: 37.8813, lng: 127.7298 },
  '원주': { address: '강원도 원주시', lat: 37.3422, lng: 127.9202 },
  '강릉': { address: '강원도 강릉시', lat: 37.7519, lng: 128.8761 },
  '속초': { address: '강원도 속초시', lat: 38.2070, lng: 128.5918 },

  // 충청도
  '청주': { address: '충청북도 청주시', lat: 36.6424, lng: 127.4890 },
  '충주': { address: '충청북도 충주시', lat: 36.9910, lng: 127.9260 },
  '천안': { address: '충청남도 천안시', lat: 36.8151, lng: 127.1139 },
  '아산': { address: '충청남도 아산시', lat: 36.7898, lng: 127.0016 },
  '공주': { address: '충청남도 공주시', lat: 36.4465, lng: 127.1189 },

  // 전라도
  '전주': { address: '전라북도 전주시', lat: 35.8242, lng: 127.1480 },
  '익산': { address: '전라북도 익산시', lat: 35.9483, lng: 126.9575 },
  '군산': { address: '전라북도 군산시', lat: 35.9676, lng: 126.7368 },
  '목포': { address: '전라남도 목포시', lat: 34.8118, lng: 126.3922 },
  '여수': { address: '전라남도 여수시', lat: 34.7604, lng: 127.6622 },
  '순천': { address: '전라남도 순천시', lat: 34.9506, lng: 127.4872 },

  // 경상도
  '포항': { address: '경상북도 포항시', lat: 36.0190, lng: 129.3435 },
  '경주': { address: '경상북도 경주시', lat: 35.8562, lng: 129.2247 },
  '안동': { address: '경상북도 안동시', lat: 36.5684, lng: 128.7294 },
  '창원': { address: '경상남도 창원시', lat: 35.2280, lng: 128.6811 },
  '진주': { address: '경상남도 진주시', lat: 35.1800, lng: 128.1076 },
  '김해': { address: '경상남도 김해시', lat: 35.2285, lng: 128.8894 },

  // 제주도
  '제주': { address: '제주특별자치도 제주시', lat: 33.4996, lng: 126.5312 },
  '서귀포': { address: '제주특별자치도 서귀포시', lat: 33.2541, lng: 126.5601 },
}

// 도시 이름으로 검색 (부분 일치)
export const searchKoreanCity = (query: string): Location | null => {
  if (!query) return null

  const normalizedQuery = query.trim().toLowerCase()

  // 정확히 일치하는 도시 찾기
  for (const [cityName, location] of Object.entries(KOREAN_CITIES)) {
    if (cityName.toLowerCase() === normalizedQuery) {
      return location
    }
  }

  // 부분 일치하는 도시 찾기
  for (const [cityName, location] of Object.entries(KOREAN_CITIES)) {
    if (cityName.toLowerCase().includes(normalizedQuery) || normalizedQuery.includes(cityName.toLowerCase())) {
      return location
    }
  }

  // 주소에 포함된 경우
  for (const [cityName, location] of Object.entries(KOREAN_CITIES)) {
    if (location.address.includes(query)) {
      return location
    }
  }

  return null
}

// 자동완성 제안 목록
export const getSuggestions = (query: string): string[] => {
  if (!query) return []

  const normalizedQuery = query.trim().toLowerCase()
  const suggestions: string[] = []

  for (const cityName of Object.keys(KOREAN_CITIES)) {
    if (cityName.toLowerCase().includes(normalizedQuery)) {
      suggestions.push(cityName)
    }
  }

  return suggestions.slice(0, 5) // 최대 5개
}
