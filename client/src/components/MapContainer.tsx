import React, { useEffect, useRef, useState } from 'react'
import { GoogleMapsService } from '@services/googleMaps'
import { MapLocation, MarkerData, Route } from '@types/map'

interface MapContainerProps {
  center?: MapLocation
  zoom?: number
  markers?: MarkerData[]
  routes?: Route[]
  selectedRouteId?: string | null
  onMarkerClick?: (marker: MarkerData) => void
  className?: string
}

const DEFAULT_CENTER: MapLocation = {
  lat: 37.5665,
  lng: 126.978,
  address: '서울특별시 중구 태평로1가 31',
  name: '서울시청',
}

export const MapContainer: React.FC<MapContainerProps> = ({
  center = DEFAULT_CENTER,
  zoom = 12,
  markers = [],
  routes = [],
  selectedRouteId = null,
  onMarkerClick,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapServiceRef = useRef<GoogleMapsService | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 지도 초기화
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Google Maps API가 로드되었는지 확인
    if (!window.google?.maps) {
      console.warn('Google Maps API가 아직 로드되지 않았습니다.')
      setError('지도를 불러오는 중입니다...')

      // API 로드 대기
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkInterval)
          initializeMap()
        }
      }, 100)

      return () => clearInterval(checkInterval)
    }

    initializeMap()
  }, [])

  const initializeMap = () => {
    if (!mapContainerRef.current) return

    try {
      const mapService = new GoogleMapsService()
      mapService.initMap(mapContainerRef.current, center, zoom)
      mapServiceRef.current = mapService
      setIsMapLoaded(true)
      setError(null)
    } catch (err) {
      console.error('지도 초기화 오류:', err)
      setError('지도를 불러올 수 없습니다.')
    }
  }

  // 마커 업데이트
  useEffect(() => {
    if (!isMapLoaded || !mapServiceRef.current) return

    // 기존 마커 제거
    mapServiceRef.current.clearMarkers()

    // 새 마커 추가
    markers.forEach((markerData) => {
      mapServiceRef.current?.addMarker(markerData, onMarkerClick)
    })

    // 마커들이 모두 보이도록 지도 범위 조정
    if (markers.length > 0) {
      const locations = markers.map((m) => m.position)
      mapServiceRef.current.fitBounds(locations)
    }
  }, [isMapLoaded, markers, onMarkerClick])

  // 경로 업데이트
  useEffect(() => {
    if (!isMapLoaded || !mapServiceRef.current) return

    // 기존 경로 제거
    mapServiceRef.current.clearRoutes()

    // 새 경로 그리기
    if (routes.length > 0) {
      if (selectedRouteId) {
        // 선택된 경로만 강조
        mapServiceRef.current.highlightRoute(selectedRouteId, routes)
      } else {
        // 모든 경로 표시
        routes.forEach((route) => {
          mapServiceRef.current?.drawRoute(route, false)
        })
      }
    }
  }, [isMapLoaded, routes, selectedRouteId])

  return (
    <div className={`relative ${className}`}>
      {/* 지도 컨테이너 */}
      <div ref={mapContainerRef} className="w-full h-full rounded-xl overflow-hidden" />

      {/* 로딩/에러 오버레이 */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-center">
            {error ? (
              <>
                <div className="text-gray-600 mb-2">{error}</div>
                <div className="text-sm text-gray-500">
                  Google Maps API 키가 필요합니다.
                </div>
              </>
            ) : (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
                <div className="text-gray-600">지도를 불러오는 중...</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 지도 컨트롤 정보 (옵션) */}
      {isMapLoaded && (
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-gray-700">지도 활성화</span>
          </div>
        </div>
      )}

      {/* 범례 */}
      {isMapLoaded && markers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <div className="text-xs font-semibold text-gray-700 mb-2">범례</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-lg">🔴</span>
              <span className="text-gray-600">출발지</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-lg">🔵</span>
              <span className="text-gray-600">도착지</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-lg">🟡</span>
              <span className="text-gray-600">추천 장소</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
