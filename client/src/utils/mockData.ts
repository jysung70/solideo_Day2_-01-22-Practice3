import { Route, MarkerData, MapLocation } from '@types/map'

// 서울 주요 지점
export const MOCK_LOCATIONS: Record<string, MapLocation> = {
  seoul_station: {
    lat: 37.5546788,
    lng: 126.9709914,
    address: '서울특별시 중구 봉래동2가 122',
    name: '서울역',
  },
  gangnam_station: {
    lat: 37.4979462,
    lng: 127.0276368,
    address: '서울특별시 강남구 역삼동 737',
    name: '강남역',
  },
  hongdae: {
    lat: 37.5563614,
    lng: 126.9227004,
    address: '서울특별시 마포구 서교동 394-1',
    name: '홍대입구역',
  },
  namsan_tower: {
    lat: 37.5511694,
    lng: 126.9882266,
    address: '서울특별시 용산구 용산동2가 산1-3',
    name: 'N서울타워',
  },
  gyeongbokgung: {
    lat: 37.5796147,
    lng: 126.9769953,
    address: '서울특별시 종로구 사직로 161',
    name: '경복궁',
  },
  myeongdong: {
    lat: 37.5636626,
    lng: 126.9826169,
    address: '서울특별시 중구 명동2가',
    name: '명동',
  },
}

// 더미 경로 데이터
export const MOCK_ROUTES: Route[] = [
  {
    id: 'route-1',
    type: 'recommended',
    name: '추천 경로',
    duration: 80, // 1시간 20분
    cost: 3500,
    transfers: 1,
    distance: 12500,
    color: '#3B82F6', // 파란색
    steps: [
      {
        mode: 'subway',
        from: MOCK_LOCATIONS.seoul_station,
        to: { ...MOCK_LOCATIONS.gangnam_station, name: '교대역' },
        duration: 25,
        distance: 8000,
        instruction: '2호선 강남역 방면',
        line: '2호선',
        lineColor: '#00A84D',
      },
      {
        mode: 'walk',
        from: { ...MOCK_LOCATIONS.gangnam_station, name: '교대역' },
        to: { ...MOCK_LOCATIONS.gangnam_station, name: '교대역 3번출구' },
        duration: 5,
        distance: 200,
        instruction: '3번 출구로 이동',
      },
      {
        mode: 'bus',
        from: { ...MOCK_LOCATIONS.gangnam_station, name: '교대역 3번출구' },
        to: MOCK_LOCATIONS.gangnam_station,
        duration: 50,
        distance: 4300,
        instruction: '146번 버스 탑승',
        line: '146번',
        lineColor: '#33CC99',
      },
    ],
  },
  {
    id: 'route-2',
    type: 'fastest',
    name: '최단시간 경로',
    duration: 58,
    cost: 4200,
    transfers: 2,
    distance: 11200,
    color: '#EF4444', // 빨간색
    steps: [
      {
        mode: 'subway',
        from: MOCK_LOCATIONS.seoul_station,
        to: { ...MOCK_LOCATIONS.hongdae, name: '신촌역' },
        duration: 15,
        distance: 4000,
        instruction: '2호선 신촌역 방면',
        line: '2호선',
        lineColor: '#00A84D',
      },
      {
        mode: 'subway',
        from: { ...MOCK_LOCATIONS.hongdae, name: '신촌역' },
        to: { ...MOCK_LOCATIONS.gangnam_station, name: '선릉역' },
        duration: 35,
        distance: 6500,
        instruction: '신분당선 강남역 방면',
        line: '신분당선',
        lineColor: '#D4003B',
      },
      {
        mode: 'walk',
        from: { ...MOCK_LOCATIONS.gangnam_station, name: '선릉역' },
        to: MOCK_LOCATIONS.gangnam_station,
        duration: 8,
        distance: 700,
        instruction: '도보 이동',
      },
    ],
  },
  {
    id: 'route-3',
    type: 'cheapest',
    name: '최저비용 경로',
    duration: 105, // 1시간 45분
    cost: 2800,
    transfers: 1,
    distance: 13800,
    color: '#10B981', // 초록색
    steps: [
      {
        mode: 'bus',
        from: MOCK_LOCATIONS.seoul_station,
        to: { ...MOCK_LOCATIONS.myeongdong, name: '명동역' },
        duration: 30,
        distance: 3500,
        instruction: '9401번 버스 탑승',
        line: '9401번',
        lineColor: '#FF6B6B',
      },
      {
        mode: 'walk',
        from: { ...MOCK_LOCATIONS.myeongdong, name: '명동역' },
        to: { ...MOCK_LOCATIONS.myeongdong, name: '명동역 환승통로' },
        duration: 7,
        distance: 300,
        instruction: '환승 통로 이동',
      },
      {
        mode: 'subway',
        from: { ...MOCK_LOCATIONS.myeongdong, name: '명동역 환승통로' },
        to: MOCK_LOCATIONS.gangnam_station,
        duration: 68,
        distance: 10000,
        instruction: '4호선 당고개 방면',
        line: '4호선',
        lineColor: '#00A5DE',
      },
    ],
  },
]

// 더미 추천 장소 마커
export const MOCK_RECOMMENDATION_MARKERS: MarkerData[] = [
  {
    position: MOCK_LOCATIONS.namsan_tower,
    type: 'recommendation',
    title: 'N서울타워',
    description: '서울의 랜드마크 전망대',
    arrivalTime: '14:30',
  },
  {
    position: MOCK_LOCATIONS.gyeongbokgung,
    type: 'recommendation',
    title: '경복궁',
    description: '조선시대 대표 궁궐',
    arrivalTime: '15:45',
  },
  {
    position: MOCK_LOCATIONS.myeongdong,
    type: 'recommendation',
    title: '명동 쇼핑거리',
    description: '서울 최대 쇼핑 명소',
    arrivalTime: '17:00',
  },
]

// 기본 출발지/도착지 마커
export const createOriginDestinationMarkers = (
  origin?: MapLocation,
  destination?: MapLocation
): MarkerData[] => {
  const markers: MarkerData[] = []

  if (origin) {
    markers.push({
      position: origin,
      type: 'origin',
      title: '출발지',
      description: origin.address,
    })
  }

  if (destination) {
    markers.push({
      position: destination,
      type: 'destination',
      title: '도착지',
      description: destination.address,
    })
  }

  return markers
}
