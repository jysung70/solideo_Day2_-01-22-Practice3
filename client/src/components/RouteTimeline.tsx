import React from 'react'
import { RouteOption, TransitStep } from '@/types/transit'
import { formatRemainingTime } from '@/services/transitService'

interface RouteTimelineProps {
  route: RouteOption
  isDelayed?: boolean
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  route,
  isDelayed = false,
}) => {
  const getStepIcon = (mode: TransitStep['mode']): string => {
    switch (mode) {
      case 'bus':
        return '🚌'
      case 'subway':
        return '🚇'
      case 'train':
        return '🚄'
      case 'walk':
        return '🚶'
      default:
        return '📍'
    }
  }

  const getStepColor = (mode: TransitStep['mode']): string => {
    switch (mode) {
      case 'bus':
        return 'text-green-600 bg-green-50'
      case 'subway':
        return 'text-blue-600 bg-blue-50'
      case 'train':
        return 'text-purple-600 bg-purple-50'
      case 'walk':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStepDetails = (step: TransitStep): string => {
    if (step.details.type === 'bus') {
      return `${step.details.busNumber}번 (${step.details.stops}정거장)`
    } else if (step.details.type === 'subway') {
      return `${step.details.line} (${step.details.stops}정거장)`
    } else if (step.details.type === 'train') {
      return `${step.details.trainType} ${step.details.trainNumber}`
    } else if (step.details.type === 'walk') {
      return `${step.distance}m`
    }
    return ''
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          경로 {route.type === 'recommended' ? '(추천)' : route.type === 'fastest' ? '(최단시간)' : '(최저비용)'}
        </h3>
        {isDelayed && (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
            지연
          </span>
        )}
      </div>

      {/* 타임라인 */}
      <div className="relative">
        {/* 세로 라인 */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>

        {route.steps.map((step, index) => (
          <div key={index} className="relative mb-6 last:mb-0">
            {/* 타임스탬프 (첫 번째와 마지막 스텝만) */}
            {(index === 0 || index === route.steps.length - 1) && (
              <div className="text-sm font-semibold text-gray-700 mb-2">
                {index === 0
                  ? formatTime(route.departureTime)
                  : formatTime(route.arrivalTime)}
              </div>
            )}

            {/* 스텝 아이콘 */}
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl z-10 ${getStepColor(
                  step.mode
                )}`}
              >
                {getStepIcon(step.mode)}
              </div>

              {/* 스텝 정보 */}
              <div className="ml-4 flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* 출발지 */}
                      <div className="text-sm text-gray-600 mb-1">
                        {step.from.name}
                      </div>

                      {/* 교통수단 정보 */}
                      <div className="font-semibold text-gray-900 mb-1">
                        {step.mode === 'walk' ? '도보' : getStepDetails(step)}
                      </div>

                      {/* 도착지 */}
                      <div className="text-sm text-gray-600">
                        {step.to.name}
                      </div>

                      {/* 도보 안내 */}
                      {step.details.type === 'walk' && (
                        <div className="mt-2 text-sm text-gray-500 italic">
                          {step.details.instruction}
                        </div>
                      )}
                    </div>

                    {/* 소요 시간 */}
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-primary-600">
                        {step.duration}분
                      </div>
                      {step.details.type !== 'walk' && (
                        <div className="text-sm text-gray-500">
                          {(step.details as any).fare?.toLocaleString()}원
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 화살표 (마지막 스텝 제외) */}
            {index < route.steps.length - 1 && (
              <div className="ml-6 my-2 text-gray-400 text-sm">↓</div>
            )}
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* 요약 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">총 소요시간</div>
          <div className="text-xl font-bold text-gray-900">
            {route.totalDuration}분
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">총 비용</div>
          <div className="text-xl font-bold text-primary-600">
            {route.totalCost.toLocaleString()}원
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">총 거리</div>
          <div className="text-lg font-semibold text-gray-900">
            {(route.totalDistance / 1000).toFixed(1)}km
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">환승</div>
          <div className="text-lg font-semibold text-gray-900">
            {route.steps.filter((s) => s.mode !== 'walk').length - 1}회
          </div>
        </div>
      </div>
    </div>
  )
}
