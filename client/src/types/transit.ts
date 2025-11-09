import { Location } from './index'

// 버스 도착 정보
export interface BusArrival {
  busNumber: string
  remainingTime: number // 초
  remainingStops: number
  busType: 'express' | 'regular' | 'local'
  lowFloor: boolean // 저상버스 여부
  stationName: string
}

// 지하철 도착 정보
export interface SubwayArrival {
  line: string // '2호선'
  destination: string
  remainingTime: number // 초
  trainType: 'express' | 'regular'
  congestion: 'low' | 'medium' | 'high'
  direction: 'up' | 'down' // 상행/하행
  stationName: string
}

// 경로 옵션
export interface RouteOption {
  id: string
  type: 'recommended' | 'fastest' | 'cheapest'
  totalDuration: number // 분
  totalCost: number // 원
  totalDistance: number // 미터
  steps: TransitStep[]
  departureTime: Date
  arrivalTime: Date
}

// 교통 수단 단계
export interface TransitStep {
  mode: 'bus' | 'subway' | 'walk' | 'train'
  from: {
    name: string
    location: Location
  }
  to: {
    name: string
    location: Location
  }
  duration: number // 분
  distance: number // 미터
  details: BusDetails | SubwayDetails | WalkDetails | TrainDetails
}

// 버스 상세 정보
export interface BusDetails {
  type: 'bus'
  busNumber: string
  stops: number
  fare: number
  busType: 'express' | 'regular' | 'local'
}

// 지하철 상세 정보
export interface SubwayDetails {
  type: 'subway'
  line: string
  stops: number
  fare: number
  express: boolean
}

// 도보 상세 정보
export interface WalkDetails {
  type: 'walk'
  instruction: string
}

// 기차 상세 정보
export interface TrainDetails {
  type: 'train'
  trainType: 'KTX' | 'ITX' | 'Mugunghwa'
  trainNumber: string
  fare: number
  seatType: 'standard' | 'first'
}

// 비용 내역
export interface CostBreakdown {
  transportation: {
    bus: number
    subway: number
    train: number
    taxi: number
    total: number
  }
  food: {
    breakfast: number
    lunch: number
    dinner: number
    snacks: number
    total: number
  }
  activities: {
    admission: number
    experiences: number
    souvenirs: number
    total: number
  }
  accommodation?: {
    nights: number
    pricePerNight: number
    total: number
  }
  total: number
}

// 실시간 정보 업데이트 상태
export interface RealtimeStatus {
  lastUpdated: Date
  isDelayed: boolean
  delayMinutes?: number
  status: 'normal' | 'delayed' | 'suspended'
  message?: string
}
