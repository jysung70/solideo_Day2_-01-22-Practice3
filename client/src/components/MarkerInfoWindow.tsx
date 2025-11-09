import React from 'react'
import { MarkerData } from '@types/map'
import { Button } from './Button'

interface MarkerInfoWindowProps {
  marker: MarkerData | null
  onClose: () => void
  onViewDetails?: (marker: MarkerData) => void
  onAddToRoute?: (marker: MarkerData) => void
}

export const MarkerInfoWindow: React.FC<MarkerInfoWindowProps> = ({
  marker,
  onClose,
  onViewDetails,
  onAddToRoute,
}) => {
  if (!marker) return null

  const getMarkerIcon = (type: MarkerData['type']) => {
    switch (type) {
      case 'origin':
        return '🔴'
      case 'destination':
        return '🔵'
      case 'recommendation':
        return '🟡'
      default:
        return '📍'
    }
  }

  const getMarkerTypeLabel = (type: MarkerData['type']) => {
    switch (type) {
      case 'origin':
        return '출발지'
      case 'destination':
        return '도착지'
      case 'recommendation':
        return '추천 장소'
      default:
        return ''
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-slide-up">
      {/* 헤더 */}
      <div className="flex items-start justify-between p-4 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{getMarkerIcon(marker.type)}</span>
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">
              {getMarkerTypeLabel(marker.type)}
            </div>
            <h3 className="text-lg font-bold text-gray-800">{marker.title}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
          aria-label="닫기"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* 내용 */}
      <div className="p-4 space-y-3">
        {/* 주소 */}
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm text-gray-600">{marker.position.address}</p>
        </div>

        {/* 설명 */}
        {marker.description && (
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
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
            <p className="text-sm text-gray-600">{marker.description}</p>
          </div>
        )}

        {/* 도착 예정 시간 */}
        {marker.arrivalTime && (
          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-700">
              도착 예정: {marker.arrivalTime}
            </span>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(marker)}
            className="flex-1"
          >
            상세보기
          </Button>
        )}
        {onAddToRoute && marker.type === 'recommendation' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToRoute(marker)}
            className="flex-1"
          >
            경로추가
          </Button>
        )}
      </div>
    </div>
  )
}
