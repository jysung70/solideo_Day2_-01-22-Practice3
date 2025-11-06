export interface Location {
  address: string
  lat: number
  lng: number
  placeId?: string
}

export interface TravelInput {
  origin: Location | null
  destination: Location | null
  departureDate: Date | null
  departureTime: string
  duration: number // 일 단위
  participants: number
}

export type TravelDuration = 'daytrip' | '1night' | '2nights' | 'custom'

export interface TravelPreferences {
  foodStyle: string[]
  tourStyle: string[]
  budget: 'low' | 'medium' | 'high'
}
