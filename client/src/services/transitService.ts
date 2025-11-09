import axios from 'axios'
import { Location } from '@/types'
import {
  BusArrival,
  SubwayArrival,
  RouteOption,
  CostBreakdown,
} from '@/types/transit'
import {
  MOCK_BUS_ARRIVALS,
  MOCK_SUBWAY_ARRIVALS,
  MOCK_ROUTE_OPTIONS,
  MOCK_COST_BREAKDOWN,
  calculateRouteCost,
} from '@/mocks/transitData'

const PUBLIC_DATA_API_KEY = import.meta.env.VITE_PUBLIC_DATA_API_KEY
const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY
const USE_MOCK_DATA = !PUBLIC_DATA_API_KEY

// API 클라이언트 설정
const publicDataClient = axios.create({
  baseURL: 'http://apis.data.go.kr',
  timeout: 10000,
})

const kakaoClient = axios.create({
  baseURL: 'https://dapi.kakao.com',
  timeout: 10000,
  headers: {
    Authorization: `KakaoAK ${KAKAO_API_KEY}`,
  },
})

/**
 * 버스 실시간 도착 정보 조회
 */
export const getBusArrival = async (stationId: string): Promise<BusArrival[]> => {
  if (USE_MOCK_DATA) {
    console.log('🚌 Using mock bus arrival data')
    // 실제 API 호출 시뮬레이션 (500ms 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 500))
    return MOCK_BUS_ARRIVALS
  }

  try {
    // 실제 공공데이터포털 API 호출
    const response = await publicDataClient.get('/bus/arrival', {
      params: {
        serviceKey: PUBLIC_DATA_API_KEY,
        stationId,
      },
    })

    // API 응답 데이터를 BusArrival 형식으로 변환
    return response.data.items.map((item: any) => ({
      busNumber: item.busRouteAbrv,
      remainingTime: item.traTime1 * 60, // 분을 초로 변환
      remainingStops: item.stationCount1,
      busType: item.routeType === '3' ? 'express' : 'regular',
      lowFloor: item.busType1 === '1',
      stationName: item.stationNm,
    }))
  } catch (error) {
    console.error('버스 도착 정보 조회 실패:', error)
    throw error
  }
}

/**
 * 지하철 실시간 도착 정보 조회
 */
export const getSubwayArrival = async (
  stationId: string
): Promise<SubwayArrival[]> => {
  if (USE_MOCK_DATA) {
    console.log('🚇 Using mock subway arrival data')
    await new Promise((resolve) => setTimeout(resolve, 500))
    return MOCK_SUBWAY_ARRIVALS
  }

  try {
    // 실제 공공데이터포털 API 호출
    const response = await publicDataClient.get('/subway/arrival', {
      params: {
        serviceKey: PUBLIC_DATA_API_KEY,
        stationId,
      },
    })

    return response.data.items.map((item: any) => ({
      line: item.subwayId + '호선',
      destination: item.trainLineNm,
      remainingTime: parseInt(item.barvlDt),
      trainType: item.btrainSttus === '급행' ? 'express' : 'regular',
      congestion:
        item.reride_Num < 30
          ? 'low'
          : item.reride_Num < 70
          ? 'medium'
          : 'high',
      direction: item.updnLine === '상행' ? 'up' : 'down',
      stationName: item.statnNm,
    }))
  } catch (error) {
    console.error('지하철 도착 정보 조회 실패:', error)
    throw error
  }
}

/**
 * 경로 검색
 */
export const searchRoute = async (
  origin: Location,
  destination: Location,
  departureTime: Date
): Promise<RouteOption[]> => {
  if (USE_MOCK_DATA) {
    console.log('🗺️ Using mock route data')
    await new Promise((resolve) => setTimeout(resolve, 800))
    return MOCK_ROUTE_OPTIONS
  }

  try {
    // 카카오 길찾기 API 호출
    const response = await kakaoClient.get('/v2/local/search/address', {
      params: {
        origin: `${origin.lng},${origin.lat}`,
        destination: `${destination.lng},${destination.lat}`,
        priority: 'RECOMMEND',
      },
    })

    // API 응답을 RouteOption 형식으로 변환
    return response.data.routes.map((route: any, index: number) => ({
      id: `route-${index}`,
      type: index === 0 ? 'recommended' : index === 1 ? 'fastest' : 'cheapest',
      totalDuration: Math.round(route.duration / 60),
      totalCost: route.fare.regular.totalFare,
      totalDistance: route.distance,
      steps: route.sections.map((section: any) => ({
        mode: section.mode,
        from: {
          name: section.startName,
          location: {
            lat: section.startY,
            lng: section.startX,
            address: section.startName,
          },
        },
        to: {
          name: section.endName,
          location: {
            lat: section.endY,
            lng: section.endX,
            address: section.endName,
          },
        },
        duration: Math.round(section.duration / 60),
        distance: section.distance,
        details: {
          type: section.mode,
          ...section,
        },
      })),
      departureTime,
      arrivalTime: new Date(departureTime.getTime() + route.duration * 1000),
    }))
  } catch (error) {
    console.error('경로 검색 실패:', error)
    throw error
  }
}

/**
 * 경로 비용 계산
 */
export const calculateCost = (route: RouteOption): number => {
  return calculateRouteCost(route)
}

/**
 * 비용 상세 내역 조회
 */
export const getCostBreakdown = async (
  route: RouteOption,
  participants: number = 1,
  duration: number = 1
): Promise<CostBreakdown> => {
  if (USE_MOCK_DATA) {
    console.log('💰 Using mock cost breakdown data')
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock 데이터를 인원수와 기간에 맞게 조정
    return {
      transportation: {
        ...MOCK_COST_BREAKDOWN.transportation,
        total: MOCK_COST_BREAKDOWN.transportation.total * participants,
      },
      food: {
        ...MOCK_COST_BREAKDOWN.food,
        total: MOCK_COST_BREAKDOWN.food.total * participants * duration,
      },
      activities: {
        ...MOCK_COST_BREAKDOWN.activities,
        total: MOCK_COST_BREAKDOWN.activities.total * participants,
      },
      accommodation: duration > 1 ? {
        nights: duration - 1,
        pricePerNight: 80000,
        total: 80000 * (duration - 1),
      } : undefined,
      total:
        MOCK_COST_BREAKDOWN.transportation.total * participants +
        MOCK_COST_BREAKDOWN.food.total * participants * duration +
        MOCK_COST_BREAKDOWN.activities.total * participants +
        (duration > 1 ? 80000 * (duration - 1) : 0),
    }
  }

  // 실제 비용 계산 로직
  const transportationCost = calculateRouteCost(route) * participants
  const foodCost = 32000 * participants * duration // 1인 1일 식비
  const activityCost = 35000 * participants // 1인 활동비
  const accommodationCost = duration > 1 ? 80000 * (duration - 1) : 0

  return {
    transportation: {
      bus: route.steps
        .filter((s) => s.details.type === 'bus')
        .reduce((sum, s) => sum + (s.details as any).fare, 0) * participants,
      subway: route.steps
        .filter((s) => s.details.type === 'subway')
        .reduce((sum, s) => sum + (s.details as any).fare, 0) * participants,
      train: route.steps
        .filter((s) => s.details.type === 'train')
        .reduce((sum, s) => sum + (s.details as any).fare, 0) * participants,
      taxi: 0,
      total: transportationCost,
    },
    food: {
      breakfast: 8000 * participants * duration,
      lunch: 12000 * participants * duration,
      dinner: 15000 * participants * duration,
      snacks: 5000 * participants * duration,
      total: foodCost,
    },
    activities: {
      admission: 10000 * participants,
      experiences: 5000 * participants,
      souvenirs: 20000 * participants,
      total: activityCost,
    },
    accommodation: duration > 1 ? {
      nights: duration - 1,
      pricePerNight: 80000,
      total: accommodationCost,
    } : undefined,
    total: transportationCost + foodCost + activityCost + accommodationCost,
  }
}

// 시간 포맷팅 헬퍼 함수
export const formatRemainingTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}초`
  }
  const minutes = Math.floor(seconds / 60)
  return `${minutes}분`
}

// 혼잡도 텍스트 변환
export const getCongestionText = (
  congestion: 'low' | 'medium' | 'high'
): string => {
  switch (congestion) {
    case 'low':
      return '여유'
    case 'medium':
      return '보통'
    case 'high':
      return '혼잡'
  }
}

// 버스 타입 텍스트 변환
export const getBusTypeText = (
  busType: 'express' | 'regular' | 'local'
): string => {
  switch (busType) {
    case 'express':
      return '광역버스'
    case 'regular':
      return '간선버스'
    case 'local':
      return '지선버스'
  }
}
