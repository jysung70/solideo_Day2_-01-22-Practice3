import React, { useState } from 'react'
import { MapContainer } from '@components/MapContainer'
import { RouteInfo } from '@components/RouteInfo'
import { MarkerInfoWindow } from '@components/MarkerInfoWindow'
import { MarkerData } from '@types/map'
import {
  MOCK_ROUTES,
  MOCK_LOCATIONS,
  MOCK_RECOMMENDATION_MARKERS,
  createOriginDestinationMarkers,
} from '@utils/mockData'

export const MapPage: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('route-1')
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [showRoutePanel, setShowRoutePanel] = useState(true)

  // 더미 데이터: 서울역 → 강남역
  const origin = MOCK_LOCATIONS.seoul_station
  const destination = MOCK_LOCATIONS.gangnam_station

  // 마커 생성
  const markers = [
    ...createOriginDestinationMarkers(origin, destination),
    ...MOCK_RECOMMENDATION_MARKERS,
  ]

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
    alert(`${route.name} 상세보기 (개발 중)`)
  }

  const handleViewMarkerDetails = (marker: MarkerData) => {
    console.log('마커 상세보기:', marker)
    alert(`${marker.title} 상세보기 (개발 중)`)
  }

  const handleAddToRoute = (marker: MarkerData) => {
    console.log('경로에 추가:', marker)
    alert(`${marker.title}을(를) 경로에 추가했습니다! (개발 중)`)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 헤더 정보 */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">경로 탐색</h1>
              <p className="text-sm text-gray-600 mt-1">
                {origin.name} → {destination.name}
              </p>
            </div>
            <button
              onClick={() => setShowRoutePanel(!showRoutePanel)}
              className="md:hidden px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              {showRoutePanel ? '지도 보기' : '경로 보기'}
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 경로 정보 사이드바 (데스크톱) */}
        <div
          className={`
            ${showRoutePanel ? 'block' : 'hidden'}
            md:block md:w-96 bg-gray-50 p-4 overflow-y-auto
          `}
        >
          <RouteInfo
            routes={MOCK_ROUTES}
            selectedRouteId={selectedRouteId}
            onSelectRoute={handleSelectRoute}
            onViewDetails={handleViewRouteDetails}
          />

          {/* 여행 정보 요약 */}
          <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3">여행 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">출발지</span>
                <span className="font-medium text-gray-800">{origin.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">도착지</span>
                <span className="font-medium text-gray-800">{destination.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">추천 장소</span>
                <span className="font-medium text-gray-800">
                  {MOCK_RECOMMENDATION_MARKERS.length}곳
                </span>
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">더미 데이터 사용 중</p>
                <p className="text-blue-700">
                  현재는 테스트용 더미 데이터를 사용하고 있습니다. 실제 Google Maps API
                  키를 설정하면 실시간 데이터를 사용할 수 있습니다.
                </p>
              </div>
            </div>
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
            routes={MOCK_ROUTES}
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
