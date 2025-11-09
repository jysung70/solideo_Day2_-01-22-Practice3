import React, { useState, useEffect } from 'react'
import { MapContainer } from '@components/MapContainer'
import { RouteInfo } from '@components/RouteInfo'
import { RouteTimeline } from '@components/RouteTimeline'
import { RealtimeInfo } from '@components/RealtimeInfo'
import { CostBreakdown } from '@components/CostBreakdown'
import { MarkerInfoWindow } from '@components/MarkerInfoWindow'
import { MarkerData } from '@types/map'
import { Location } from '@/types'
import { BusArrival, SubwayArrival, CostBreakdown as CostBreakdownType } from '@types/transit'
import {
  MOCK_ROUTES,
  MOCK_LOCATIONS,
  MOCK_RECOMMENDATION_MARKERS,
  createOriginDestinationMarkers,
} from '@utils/mockData'
import {
  MOCK_ROUTE_OPTIONS,
  MOCK_BUS_ARRIVALS,
  MOCK_SUBWAY_ARRIVALS,
} from '@/mocks/transitData'
import { generateRoutes, generateRouteOptions } from '@/utils/routeGenerator'
import {
  getBusArrival,
  getSubwayArrival,
  getCostBreakdown,
} from '@/services/transitService'

type TabType = 'routes' | 'timeline' | 'realtime' | 'cost'

interface LocationState {
  origin: Location | null
  destination: Location | null
  departureDate: Date | null
  departureTime: string
  duration: number
  participants: number
}

export const MapPage: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('route-1')
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [showRoutePanel, setShowRoutePanel] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('routes')

  // 실시간 대중교통 정보
  const [busArrivals, setBusArrivals] = useState<BusArrival[]>([])
  const [subwayArrivals, setSubwayArrivals] = useState<SubwayArrival[]>([])
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownType | null>(null)
  const [realtimeType, setRealtimeType] = useState<'bus' | 'subway'>('subway')

  // localStorage에서 여행 계획 데이터 가져오기
  const getTravelData = (): LocationState | null => {
    try {
      const saved = localStorage.getItem('currentTravelPlan')
      if (!saved) {
        console.log('📍 [MapPage] localStorage에 저장된 데이터 없음')
        return null
      }

      const data = JSON.parse(saved)
      console.log('📍 [MapPage] localStorage에서 불러온 데이터:', data)

      return {
        origin: data.origin,
        destination: data.destination,
        departureDate: data.departureDate ? new Date(data.departureDate) : null,
        departureTime: data.departureTime,
        duration: data.duration,
        participants: data.participants,
      }
    } catch (error) {
      console.error('❌ [MapPage] localStorage 읽기 오류:', error)
      return null
    }
  }

  const travelData = getTravelData()

  // 사용자 입력 데이터 또는 기본값 사용
  const origin = travelData?.origin || MOCK_LOCATIONS.seoul_station
  const destination = travelData?.destination || MOCK_LOCATIONS.gangnam_station
  const participants = travelData?.participants || 1
  const duration = travelData?.duration || 1

  console.log('✅ [MapPage] FINAL origin:', origin)
  console.log('✅ [MapPage] FINAL destination:', destination)

  // 동적으로 경로 생성 (사용자 입력 기반)
  const dynamicRoutes = generateRoutes(origin, destination)
  const dynamicRouteOptions = generateRouteOptions(origin, destination)

  console.log('🗺️ [MapPage] Generated dynamic routes:', dynamicRoutes.length)
  console.log('🗺️ [MapPage] Generated dynamic route options:', dynamicRouteOptions.length)
  console.log('🗺️ [MapPage] Dynamic route IDs:', dynamicRouteOptions.map(r => r.id))

  // 선택된 경로 데이터
  const selectedRoute = dynamicRouteOptions.find(r => r.id === selectedRouteId) || dynamicRouteOptions[0]

  console.log('🎯 [MapPage] Selected route ID:', selectedRouteId)
  console.log('🎯 [MapPage] Selected route:', selectedRoute)
  console.log('🎯 [MapPage] Selected route steps:', selectedRoute?.steps.length)

  // 마커 생성
  const markers = [
    ...createOriginDestinationMarkers(origin, destination),
    ...MOCK_RECOMMENDATION_MARKERS,
  ]

  // 실시간 정보 로드
  useEffect(() => {
    const loadRealtimeInfo = async () => {
      try {
        const [busData, subwayData] = await Promise.all([
          getBusArrival('홍대입구역'),
          getSubwayArrival('홍대입구역'),
        ])
        setBusArrivals(busData)
        setSubwayArrivals(subwayData)
      } catch (error) {
        console.error('실시간 정보 로드 실패:', error)
      }
    }

    loadRealtimeInfo()
  }, [])

  // 비용 내역 로드
  useEffect(() => {
    const loadCostBreakdown = async () => {
      try {
        const cost = await getCostBreakdown(selectedRoute, participants, duration)
        setCostBreakdown(cost)
      } catch (error) {
        console.error('비용 내역 로드 실패:', error)
      }
    }

    if (selectedRoute) {
      loadCostBreakdown()
    }
  }, [selectedRoute, participants, duration])

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker)
  }

  const handleCloseMarkerInfo = () => {
    setSelectedMarker(null)
  }

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId)
  }

  const handleViewRouteDetails = (route: typeof MOCK_ROUTES[0]) => {
    console.log('경로 상세보기:', route)
    setActiveTab('timeline')
  }

  const handleViewMarkerDetails = (marker: MarkerData) => {
    console.log('마커 상세보기:', marker)
    alert(`${marker.title} 상세보기 (개발 중)`)
  }

  const handleAddToRoute = (marker: MarkerData) => {
    console.log('경로에 추가:', marker)
    alert(`${marker.title}을(를) 경로에 추가했습니다! (개발 중)`)
  }

  const handleRefreshRealtime = async () => {
    try {
      if (realtimeType === 'bus') {
        const data = await getBusArrival('홍대입구역')
        setBusArrivals(data)
      } else {
        const data = await getSubwayArrival('홍대입구역')
        setSubwayArrivals(data)
      }
    } catch (error) {
      console.error('실시간 정보 새로고침 실패:', error)
    }
  }

  const tabs = [
    { id: 'routes' as TabType, label: '경로 옵션', icon: '🗺️' },
    { id: 'timeline' as TabType, label: '타임라인', icon: '⏱️' },
    { id: 'realtime' as TabType, label: '실시간', icon: '🚇' },
    { id: 'cost' as TabType, label: '비용', icon: '💰' },
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 헤더 정보 */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">경로 탐색</h1>
              <p className="text-sm text-gray-600 mt-1">
                {(origin as any).name || origin.address} → {(destination as any).name || destination.address}
              </p>
            </div>
            <button
              onClick={() => setShowRoutePanel(!showRoutePanel)}
              className="md:hidden px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              {showRoutePanel ? '지도 보기' : '정보 보기'}
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 정보 사이드바 */}
        <div
          className={`
            ${showRoutePanel ? 'block' : 'hidden'}
            md:block md:w-96 bg-gray-50 overflow-hidden flex flex-col
          `}
        >
          {/* 탭 헤더 */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 px-3 py-3 text-sm font-medium transition-colors
                    ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg mb-1">{tab.icon}</span>
                    <span className="text-xs">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'routes' && (
              <div className="space-y-4">
                <RouteInfo
                  routes={dynamicRoutes}
                  selectedRouteId={selectedRouteId}
                  onSelectRoute={handleSelectRoute}
                  onViewDetails={handleViewRouteDetails}
                />

                {/* 안내 메시지 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-sm">
                      <p className="font-medium text-green-800 mb-1">동적 경로 생성됨</p>
                      <p className="text-green-700">
                        입력하신 출발지와 도착지를 기반으로 경로가 자동 생성되었습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <RouteTimeline route={selectedRoute} />
            )}

            {activeTab === 'realtime' && (
              <div className="space-y-4">
                {/* 버스/지하철 토글 */}
                <div className="bg-white rounded-lg shadow-sm p-2 flex gap-2">
                  <button
                    onClick={() => setRealtimeType('subway')}
                    className={`
                      flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        realtimeType === 'subway'
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    🚇 지하철
                  </button>
                  <button
                    onClick={() => setRealtimeType('bus')}
                    className={`
                      flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        realtimeType === 'bus'
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    🚌 버스
                  </button>
                </div>

                {/* 실시간 정보 */}
                {realtimeType === 'subway' ? (
                  <RealtimeInfo
                    type="subway"
                    arrivals={subwayArrivals}
                    stationName="홍대입구역"
                    onRefresh={handleRefreshRealtime}
                  />
                ) : (
                  <RealtimeInfo
                    type="bus"
                    arrivals={busArrivals}
                    stationName="홍대입구역"
                    onRefresh={handleRefreshRealtime}
                  />
                )}
              </div>
            )}

            {activeTab === 'cost' && costBreakdown && (
              <CostBreakdown costBreakdown={costBreakdown} participants={participants} />
            )}
          </div>
        </div>

        {/* 지도 영역 */}
        <div
          className={`
            ${showRoutePanel ? 'hidden md:block' : 'block'}
            flex-1 p-4
          `}
        >
          <MapContainer
            center={origin}
            zoom={12}
            markers={markers}
            routes={dynamicRoutes}
            selectedRouteId={selectedRouteId}
            onMarkerClick={handleMarkerClick}
            className="h-full"
          />
        </div>
      </div>

      {/* 마커 정보 윈도우 */}
      {selectedMarker && (
        <MarkerInfoWindow
          marker={selectedMarker}
          onClose={handleCloseMarkerInfo}
          onViewDetails={handleViewMarkerDetails}
          onAddToRoute={handleAddToRoute}
        />
      )}
    </div>
  )
}
