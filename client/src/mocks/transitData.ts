import {
  BusArrival,
  SubwayArrival,
  RouteOption,
  TransitStep,
  CostBreakdown,
} from '@/types/transit'

// Mock 버스 도착 정보
export const MOCK_BUS_ARRIVALS: BusArrival[] = [
  {
    busNumber: '273',
    remainingTime: 120, // 2분
    remainingStops: 3,
    busType: 'regular',
    lowFloor: true,
    stationName: '홍대입구역',
  },
  {
    busNumber: '273',
    remainingTime: 480, // 8분
    remainingStops: 8,
    busType: 'regular',
    lowFloor: false,
    stationName: '홍대입구역',
  },
  {
    busNumber: '6002',
    remainingTime: 300, // 5분
    remainingStops: 5,
    busType: 'express',
    lowFloor: true,
    stationName: '홍대입구역',
  },
  {
    busNumber: '7016',
    remainingTime: 600, // 10분
    remainingStops: 7,
    busType: 'local',
    lowFloor: false,
    stationName: '홍대입구역',
  },
]

// Mock 지하철 도착 정보
export const MOCK_SUBWAY_ARRIVALS: SubwayArrival[] = [
  {
    line: '2호선',
    destination: '강남',
    remainingTime: 60, // 1분
    trainType: 'regular',
    congestion: 'high',
    direction: 'up',
    stationName: '홍대입구역',
  },
  {
    line: '2호선',
    destination: '강남',
    remainingTime: 300, // 5분
    trainType: 'regular',
    congestion: 'medium',
    direction: 'up',
    stationName: '홍대입구역',
  },
  {
    line: '2호선',
    destination: '시청',
    remainingTime: 120, // 2분
    trainType: 'regular',
    congestion: 'medium',
    direction: 'down',
    stationName: '홍대입구역',
  },
  {
    line: '2호선',
    destination: '시청',
    remainingTime: 420, // 7분
    trainType: 'regular',
    congestion: 'low',
    direction: 'down',
    stationName: '홍대입구역',
  },
]

// Mock 경로 옵션 (홍대입구역 → 강남역)
export const MOCK_ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'route-recommended',
    type: 'recommended',
    totalDuration: 25,
    totalCost: 1400,
    totalDistance: 12000,
    departureTime: new Date('2024-11-09T13:00:00'),
    arrivalTime: new Date('2024-11-09T13:25:00'),
    steps: [
      {
        mode: 'walk',
        from: {
          name: '홍대입구역 2번 출구',
          location: { lat: 37.5565, lng: 126.9235, address: '서울 마포구' },
        },
        to: {
          name: '홍대입구역 지하철',
          location: { lat: 37.5572, lng: 126.9247, address: '서울 마포구' },
        },
        duration: 3,
        distance: 200,
        details: {
          type: 'walk',
          instruction: '2번 출구에서 지하철역 방향으로 도보 이동',
        },
      },
      {
        mode: 'subway',
        from: {
          name: '홍대입구역',
          location: { lat: 37.5572, lng: 126.9247, address: '서울 마포구' },
        },
        to: {
          name: '강남역',
          location: { lat: 37.4979, lng: 127.0276, address: '서울 강남구' },
        },
        duration: 18,
        distance: 11500,
        details: {
          type: 'subway',
          line: '2호선',
          stops: 12,
          fare: 1400,
          express: false,
        },
      },
      {
        mode: 'walk',
        from: {
          name: '강남역 10번 출구',
          location: { lat: 37.4979, lng: 127.0276, address: '서울 강남구' },
        },
        to: {
          name: '목적지',
          location: { lat: 37.4985, lng: 127.0285, address: '서울 강남구' },
        },
        duration: 4,
        distance: 300,
        details: {
          type: 'walk',
          instruction: '10번 출구에서 목적지까지 도보 이동',
        },
      },
    ],
  },
  {
    id: 'route-fastest',
    type: 'fastest',
    totalDuration: 22,
    totalCost: 2500,
    totalDistance: 13500,
    departureTime: new Date('2024-11-09T13:00:00'),
    arrivalTime: new Date('2024-11-09T13:22:00'),
    steps: [
      {
        mode: 'walk',
        from: {
          name: '홍대입구역',
          location: { lat: 37.5565, lng: 126.9235, address: '서울 마포구' },
        },
        to: {
          name: '홍대입구역 버스정류장',
          location: { lat: 37.5568, lng: 126.9240, address: '서울 마포구' },
        },
        duration: 2,
        distance: 100,
        details: {
          type: 'walk',
          instruction: '버스 정류장으로 이동',
        },
      },
      {
        mode: 'bus',
        from: {
          name: '홍대입구역',
          location: { lat: 37.5568, lng: 126.9240, address: '서울 마포구' },
        },
        to: {
          name: '강남역 사거리',
          location: { lat: 37.4982, lng: 127.0280, address: '서울 강남구' },
        },
        duration: 16,
        distance: 13200,
        details: {
          type: 'bus',
          busNumber: '6002',
          stops: 8,
          fare: 2500,
          busType: 'express',
        },
      },
      {
        mode: 'walk',
        from: {
          name: '강남역 사거리',
          location: { lat: 37.4982, lng: 127.0280, address: '서울 강남구' },
        },
        to: {
          name: '목적지',
          location: { lat: 37.4985, lng: 127.0285, address: '서울 강남구' },
        },
        duration: 4,
        distance: 200,
        details: {
          type: 'walk',
          instruction: '목적지까지 도보 이동',
        },
      },
    ],
  },
  {
    id: 'route-cheapest',
    type: 'cheapest',
    totalDuration: 35,
    totalCost: 1400,
    totalDistance: 14000,
    departureTime: new Date('2024-11-09T13:00:00'),
    arrivalTime: new Date('2024-11-09T13:35:00'),
    steps: [
      {
        mode: 'walk',
        from: {
          name: '홍대입구역',
          location: { lat: 37.5565, lng: 126.9235, address: '서울 마포구' },
        },
        to: {
          name: '버스 정류장',
          location: { lat: 37.5570, lng: 126.9245, address: '서울 마포구' },
        },
        duration: 5,
        distance: 300,
        details: {
          type: 'walk',
          instruction: '일반 버스 정류장으로 이동',
        },
      },
      {
        mode: 'bus',
        from: {
          name: '홍대입구역',
          location: { lat: 37.5570, lng: 126.9245, address: '서울 마포구' },
        },
        to: {
          name: '교대역',
          location: { lat: 37.4936, lng: 127.0136, address: '서울 서초구' },
        },
        duration: 22,
        distance: 12000,
        details: {
          type: 'bus',
          busNumber: '273',
          stops: 15,
          fare: 1400,
          busType: 'regular',
        },
      },
      {
        mode: 'walk',
        from: {
          name: '교대역',
          location: { lat: 37.4936, lng: 127.0136, address: '서울 서초구' },
        },
        to: {
          name: '강남역',
          location: { lat: 37.4979, lng: 127.0276, address: '서울 강남구' },
        },
        duration: 8,
        distance: 1700,
        details: {
          type: 'walk',
          instruction: '강남역까지 도보 이동',
        },
      },
    ],
  },
]

// Mock 비용 내역
export const MOCK_COST_BREAKDOWN: CostBreakdown = {
  transportation: {
    bus: 1400,
    subway: 1400,
    train: 0,
    taxi: 0,
    total: 2800,
  },
  food: {
    breakfast: 0,
    lunch: 12000,
    dinner: 15000,
    snacks: 5000,
    total: 32000,
  },
  activities: {
    admission: 10000,
    experiences: 5000,
    souvenirs: 20000,
    total: 35000,
  },
  total: 69800,
}

// 경로별 비용 계산 함수
export const calculateRouteCost = (route: RouteOption): number => {
  return route.steps.reduce((total, step) => {
    if (step.details.type === 'bus') {
      return total + step.details.fare
    } else if (step.details.type === 'subway') {
      return total + step.details.fare
    } else if (step.details.type === 'train') {
      return total + step.details.fare
    }
    return total
  }, 0)
}

// 실시간 정보 시뮬레이션 (개발용)
export const simulateRealtimeUpdate = (
  arrivals: BusArrival[] | SubwayArrival[]
): BusArrival[] | SubwayArrival[] => {
  return arrivals.map((arrival) => ({
    ...arrival,
    remainingTime: Math.max(0, arrival.remainingTime - 30), // 30초씩 감소
  }))
}
