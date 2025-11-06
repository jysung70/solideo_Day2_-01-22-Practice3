export interface MapLocation {
  lat: number
  lng: number
  address: string
  name?: string
  placeId?: string
}

export interface RouteStep {
  mode: 'bus' | 'subway' | 'walk' | 'train'
  from: MapLocation
  to: MapLocation
  duration: number // 분
  distance: number // 미터
  instruction: string
  line?: string // 버스/지하철 노선
  lineColor?: string // 노선 색상
}

export interface Route {
  id: string
  type: 'recommended' | 'fastest' | 'cheapest'
  name: string
  duration: number // 분
  cost: number // 원
  transfers: number
  steps: RouteStep[]
  polyline?: string
  distance: number // 미터
  color: string // 경로 색상
}

export interface MarkerData {
  position: MapLocation
  type: 'origin' | 'destination' | 'recommendation'
  title: string
  description?: string
  icon?: string
  arrivalTime?: string
}

export interface InfoWindowData {
  marker: MarkerData
  isOpen: boolean
}
