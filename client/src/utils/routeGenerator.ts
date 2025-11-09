import { Route, MapLocation } from '@/types/map'
import { RouteOption, TransitStep } from '@/types/transit'

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Generate dynamic routes based on origin and destination
 */
export function generateRoutes(
  origin: MapLocation,
  destination: MapLocation
): Route[] {
  const distanceKm = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng)
  const distanceM = Math.round(distanceKm * 1000)

  console.log('🗺️ [RouteGenerator] Generating routes:')
  console.log('  📍 Origin:', origin.name || origin.address)
  console.log('  📍 Destination:', destination.name || destination.address)
  console.log('  📏 Distance:', distanceKm.toFixed(1), 'km')

  // Long distance (>100km) - Use train
  if (distanceKm > 100) {
    return generateLongDistanceRoutes(origin, destination, distanceKm, distanceM)
  }
  // Medium distance (10-100km) - Use subway with multiple transfers
  else if (distanceKm > 10) {
    return generateMediumDistanceRoutes(origin, destination, distanceKm, distanceM)
  }
  // Short distance (<10km) - Use subway or bus
  else {
    return generateShortDistanceRoutes(origin, destination, distanceKm, distanceM)
  }
}

/**
 * Generate RouteOption for timeline view
 */
export function generateRouteOptions(
  origin: MapLocation,
  destination: MapLocation
): RouteOption[] {
  const routes = generateRoutes(origin, destination)
  const now = new Date()

  return routes.map((route) => {
    const departureTime = new Date(now)
    const arrivalTime = new Date(now.getTime() + route.duration * 60 * 1000)

    const steps: TransitStep[] = route.steps.map((step) => {
      let details: any

      if (step.mode === 'walk') {
        details = {
          type: 'walk',
          instruction: step.instruction,
        }
      } else if (step.mode === 'subway') {
        details = {
          type: 'subway',
          line: step.line || '2호선',
          stops: Math.ceil(step.distance / 1000),
          fare: 1400,
          express: false,
        }
      } else if (step.mode === 'bus') {
        details = {
          type: 'bus',
          busNumber: step.line || '146',
          stops: Math.ceil(step.distance / 1500),
          fare: 1400,
          busType: 'regular' as const,
        }
      } else if (step.mode === 'train') {
        details = {
          type: 'train',
          trainType: 'KTX' as const,
          trainNumber: 'KTX-101',
          fare: Math.round(step.distance / 100) * 100, // Approximate train fare
          seatType: 'standard' as const,
        }
      }

      return {
        mode: step.mode,
        from: {
          name: step.from.name || step.from.address,
          location: step.from,
        },
        to: {
          name: step.to.name || step.to.address,
          location: step.to,
        },
        duration: step.duration,
        distance: step.distance,
        details,
      }
    })

    // route-1, route-2, route-3 형식으로 ID 생성 (기존 코드와 호환성 유지)
    const idMap: Record<string, string> = {
      'recommended': 'route-1',
      'fastest': 'route-2',
      'cheapest': 'route-3'
    }

    return {
      id: idMap[route.type] || `route-${route.type}`,
      type: route.type,
      totalDuration: route.duration,
      totalCost: route.cost,
      totalDistance: route.distance,
      departureTime,
      arrivalTime,
      steps,
    }
  })
}

// Generate routes for long distances (>100km)
function generateLongDistanceRoutes(
  origin: MapLocation,
  destination: MapLocation,
  distanceKm: number,
  distanceM: number
): Route[] {
  const trainDuration = Math.round(distanceKm / 3) // ~200km/h average for KTX
  const trainFare = Math.round(distanceKm * 50) // Approximate KTX fare

  // Recommended route: Train + minimal transfers
  // 지도에 그릴 수 있도록 실제로 다른 좌표를 사용
  const recommendedRoute: Route = {
    id: 'route-1',
    type: 'recommended',
    name: '추천 경로',
    duration: trainDuration + 30, // Train + local transit
    cost: trainFare + 2800,
    transfers: 2,
    distance: distanceM,
    color: '#3B82F6',
    steps: [
      {
        mode: 'train',
        from: origin,
        to: destination,
        duration: trainDuration,
        distance: distanceM,
        instruction: 'KTX 탑승',
        line: 'KTX',
        lineColor: '#0052A4',
      },
    ],
  }

  // Fastest route: Express train (더 빠른 KTX)
  const fastestRoute: Route = {
    id: 'route-2',
    type: 'fastest',
    name: '최단시간 경로',
    duration: trainDuration - 5,
    cost: trainFare + 4000,
    transfers: 0,
    distance: distanceM,
    color: '#EF4444',
    steps: [
      {
        mode: 'train',
        from: origin,
        to: destination,
        duration: trainDuration - 5, // Express is faster
        distance: distanceM,
        instruction: 'KTX 직통 탑승',
        line: 'KTX',
        lineColor: '#0052A4',
      },
    ],
  }

  // Cheapest route: Regular train (ITX)
  const cheapestRoute: Route = {
    id: 'route-3',
    type: 'cheapest',
    name: '최저비용 경로',
    duration: trainDuration + 30,
    cost: Math.round(trainFare * 0.6),
    transfers: 0,
    distance: distanceM,
    color: '#10B981',
    steps: [
      {
        mode: 'train',
        from: origin,
        to: destination,
        duration: trainDuration + 30, // Slower train
        distance: distanceM,
        instruction: 'ITX/무궁화호 탑승',
        line: 'ITX',
        lineColor: '#0052A4',
      },
    ],
  }

  return [recommendedRoute, fastestRoute, cheapestRoute]
}

// Generate routes for medium distances (10-100km)
function generateMediumDistanceRoutes(
  origin: MapLocation,
  destination: MapLocation,
  distanceKm: number,
  distanceM: number
): Route[] {
  const transitDuration = Math.round(distanceKm * 2) // ~30km/h average

  const recommendedRoute: Route = {
    id: 'route-1',
    type: 'recommended',
    name: '추천 경로',
    duration: transitDuration,
    cost: 2800,
    transfers: 1,
    distance: distanceM,
    color: '#3B82F6',
    steps: [
      {
        mode: 'subway',
        from: origin,
        to: destination,
        duration: transitDuration,
        distance: distanceM,
        instruction: '광역 지하철 탑승',
        line: '1호선',
        lineColor: '#0052A4',
      },
    ],
  }

  const fastestRoute: Route = {
    id: 'route-2',
    type: 'fastest',
    name: '최단시간 경로',
    duration: Math.round(transitDuration * 0.8),
    cost: 3500,
    transfers: 1,
    distance: distanceM,
    color: '#EF4444',
    steps: [
      {
        mode: 'bus',
        from: origin,
        to: destination,
        duration: Math.round(transitDuration * 0.8),
        distance: distanceM,
        instruction: '광역급행버스 직통',
        line: '광역급행',
        lineColor: '#FF6B6B',
      },
    ],
  }

  const cheapestRoute: Route = {
    id: 'route-3',
    type: 'cheapest',
    name: '최저비용 경로',
    duration: Math.round(transitDuration * 1.3),
    cost: 1400,
    transfers: 0,
    distance: distanceM,
    color: '#10B981',
    steps: [
      {
        mode: 'bus',
        from: origin,
        to: destination,
        duration: Math.round(transitDuration * 1.3),
        distance: distanceM,
        instruction: '일반버스 직통',
        line: '간선버스',
        lineColor: '#33CC99',
      },
    ],
  }

  return [recommendedRoute, fastestRoute, cheapestRoute]
}

// Generate routes for short distances (<10km)
function generateShortDistanceRoutes(
  origin: MapLocation,
  destination: MapLocation,
  distanceKm: number,
  distanceM: number
): Route[] {
  const transitDuration = Math.round(distanceKm * 3) // ~20km/h average for city transit

  const recommendedRoute: Route = {
    id: 'route-1',
    type: 'recommended',
    name: '추천 경로',
    duration: transitDuration,
    cost: 1400,
    transfers: 1,
    distance: distanceM,
    color: '#3B82F6',
    steps: [
      {
        mode: 'subway',
        from: origin,
        to: destination,
        duration: transitDuration,
        distance: distanceM,
        instruction: '지하철 2호선 탑승',
        line: '2호선',
        lineColor: '#00A84D',
      },
    ],
  }

  const fastestRoute: Route = {
    id: 'route-2',
    type: 'fastest',
    name: '최단시간 경로',
    duration: Math.round(transitDuration * 0.7),
    cost: 2500,
    transfers: 0,
    distance: distanceM,
    color: '#EF4444',
    steps: [
      {
        mode: 'bus',
        from: origin,
        to: destination,
        duration: Math.round(transitDuration * 0.7),
        distance: distanceM,
        instruction: '급행버스 직통',
        line: '광역급행',
        lineColor: '#FF6B6B',
      },
    ],
  }

  const cheapestRoute: Route = {
    id: 'route-3',
    type: 'cheapest',
    name: '최저비용 경로',
    duration: Math.round(transitDuration * 1.2),
    cost: 1400,
    transfers: 0,
    distance: distanceM,
    color: '#10B981',
    steps: [
      {
        mode: 'bus',
        from: origin,
        to: destination,
        duration: Math.round(transitDuration * 1.2),
        distance: distanceM,
        instruction: '간선버스 직통',
        line: '간선버스',
        lineColor: '#33CC99',
      },
    ],
  }

  return [recommendedRoute, fastestRoute, cheapestRoute]
}
