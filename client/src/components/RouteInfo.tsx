import React from 'react'
import { Route } from '@types/map'
import { Button } from './Button'
import clsx from 'clsx'

interface RouteInfoProps {
  routes: Route[]
  selectedRouteId: string | null
  onSelectRoute: (routeId: string) => void
  onViewDetails?: (route: Route) => void
}

export const RouteInfo: React.FC<RouteInfoProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onViewDetails,
}) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}시간 ${mins}분`
    }
    return `${mins}분`
  }

  const formatCost = (cost: number): string => {
    return `${cost.toLocaleString()}원`
  }

  const formatDistance = (meters: number): string => {
    const km = (meters / 1000).toFixed(1)
    return `${km}km`
  }

  const getRouteIcon = (type: Route['type']): string => {
    switch (type) {
      case 'recommended':
        return '🚀'
      case 'fastest':
        return '⚡'
      case 'cheapest':
        return '💰'
      default:
        return '🚌'
    }
  }

  if (routes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-500 text-center">경로를 검색해주세요</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <h2 className="text-white font-bold text-lg">경로 옵션</h2>
        <p className="text-white/80 text-sm mt-1">{routes.length}개의 경로를 찾았습니다</p>
      </div>

      {/* 경로 목록 */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId

          return (
            <div
              key={route.id}
              className={clsx(
                'p-4 cursor-pointer transition-colors',
                isSelected
                  ? 'bg-blue-50 border-l-4 border-blue-600'
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              )}
              onClick={() => onSelectRoute(route.id)}
            >
              {/* 경로 타입 및 이름 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getRouteIcon(route.type)}</span>
                  <h3 className="font-bold text-gray-800">{route.name}</h3>
                </div>
                {isSelected && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                    선택됨
                  </span>
                )}
              </div>

              {/* 주요 정보 그리드 */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">소요시간</div>
                  <div className="font-semibold text-sm text-gray-800">
                    {formatDuration(route.duration)}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">비용</div>
                  <div className="font-semibold text-sm text-gray-800">
                    {formatCost(route.cost)}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">환승</div>
                  <div className="font-semibold text-sm text-gray-800">{route.transfers}회</div>
                </div>
              </div>

              {/* 거리 정보 */}
              <div className="text-xs text-gray-500 mb-3">
                총 거리: {formatDistance(route.distance)}
              </div>

              {/* 경로 단계 미리보기 */}
              <div className="space-y-2 mb-3">
                {route.steps.slice(0, 2).map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
                        step.mode === 'subway' && 'bg-green-600',
                        step.mode === 'bus' && 'bg-blue-600',
                        step.mode === 'walk' && 'bg-gray-400',
                        step.mode === 'train' && 'bg-purple-600'
                      )}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-700 font-medium">{step.instruction}</div>
                      <div className="text-gray-500 text-xs">
                        {formatDuration(step.duration)} · {formatDistance(step.distance)}
                      </div>
                    </div>
                  </div>
                ))}
                {route.steps.length > 2 && (
                  <div className="text-xs text-gray-500 pl-8">
                    외 {route.steps.length - 2}개 구간...
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectRoute(route.id)
                  }}
                >
                  {isSelected ? '선택됨' : '선택하기'}
                </Button>
                {onViewDetails && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewDetails(route)
                    }}
                  >
                    상세
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
