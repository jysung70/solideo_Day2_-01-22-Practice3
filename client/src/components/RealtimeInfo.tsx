import React, { useState, useEffect } from 'react'
import { BusArrival, SubwayArrival } from '@/types/transit'
import {
  formatRemainingTime,
  getCongestionText,
  getBusTypeText,
} from '@/services/transitService'

interface RealtimeInfoProps {
  type: 'bus' | 'subway'
  arrivals: BusArrival[] | SubwayArrival[]
  stationName: string
  autoRefresh?: boolean
  refreshInterval?: number // 초
  onRefresh?: () => void
}

export const RealtimeInfo: React.FC<RealtimeInfoProps> = ({
  type,
  arrivals,
  stationName,
  autoRefresh = true,
  refreshInterval = 30,
  onRefresh,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [timeLeft, setTimeLeft] = useState(refreshInterval)

  useEffect(() => {
    if (!autoRefresh) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setLastUpdated(new Date())
          onRefresh?.()
          return refreshInterval
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [autoRefresh, refreshInterval, onRefresh])

  const handleManualRefresh = () => {
    setLastUpdated(new Date())
    setTimeLeft(refreshInterval)
    onRefresh?.()
  }

  // 버스 정보 렌더링
  const renderBusArrivals = (arrivals: BusArrival[]) => {
    // 버스 번호별로 그룹화
    const groupedByBus = arrivals.reduce((acc, arrival) => {
      if (!acc[arrival.busNumber]) {
        acc[arrival.busNumber] = []
      }
      acc[arrival.busNumber].push(arrival)
      return acc
    }, {} as Record<string, BusArrival[]>)

    return Object.entries(groupedByBus).map(([busNumber, busArrivals]) => (
      <div key={busNumber} className="border-b border-gray-200 last:border-b-0">
        <div className="p-4 hover:bg-gray-50 transition-colors">
          {/* 버스 번호 헤더 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🚌</span>
              <div>
                <div className="font-bold text-lg text-gray-900">
                  {busNumber}번
                </div>
                <div className="text-sm text-gray-500">
                  {getBusTypeText(busArrivals[0].busType)}
                </div>
              </div>
            </div>
            {busArrivals[0].lowFloor && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                저상
              </span>
            )}
          </div>

          {/* 도착 정보 */}
          <div className="space-y-2">
            {busArrivals.slice(0, 2).map((arrival, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded p-2"
              >
                <div className="flex items-center">
                  <span className="text-primary-600 font-bold mr-2">
                    {index === 0 ? '첫차' : '다음'}
                  </span>
                  <span className="text-gray-700">
                    {formatRemainingTime(arrival.remainingTime)} 후 도착
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {arrival.remainingStops}정거장 전
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))
  }

  // 지하철 정보 렌더링
  const renderSubwayArrivals = (arrivals: SubwayArrival[]) => {
    // 방향별로 그룹화
    const upLine = arrivals.filter((a) => a.direction === 'up')
    const downLine = arrivals.filter((a) => a.direction === 'down')

    const renderDirection = (
      directionArrivals: SubwayArrival[],
      directionLabel: string,
      icon: string
    ) => {
      if (directionArrivals.length === 0) return null

      return (
        <div className="mb-4 last:mb-0">
          <div className="flex items-center mb-3">
            <span className="text-xl mr-2">{icon}</span>
            <span className="font-semibold text-gray-700">{directionLabel}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({directionArrivals[0].destination} 방향)
            </span>
          </div>

          <div className="space-y-2">
            {directionArrivals.slice(0, 2).map((arrival, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded p-3"
              >
                <div className="flex items-center flex-1">
                  <div
                    className={`text-lg font-bold mr-3 ${
                      arrival.remainingTime < 120
                        ? 'text-red-600'
                        : 'text-primary-600'
                    }`}
                  >
                    {formatRemainingTime(arrival.remainingTime)}
                  </div>
                  <div className="text-gray-700">후 도착</div>
                </div>
                <div className="flex items-center space-x-2">
                  {arrival.trainType === 'express' && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      급행
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      arrival.congestion === 'low'
                        ? 'bg-green-100 text-green-700'
                        : arrival.congestion === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {getCongestionText(arrival.congestion)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="p-4">
        {renderDirection(upLine, '상행선', '←')}
        {renderDirection(downLine, '하행선', '→')}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{type === 'bus' ? '🚌' : '🚇'}</span>
            <h3 className="text-lg font-bold">{stationName}</h3>
          </div>
          <button
            onClick={handleManualRefresh}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="새로고침"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="opacity-90">
            {type === 'bus' ? '버스 실시간 도착' : '지하철 실시간 도착'}
          </div>
          {autoRefresh && (
            <div className="opacity-75">
              {timeLeft}초 후 갱신
            </div>
          )}
        </div>
      </div>

      {/* 도착 정보 */}
      <div className="max-h-96 overflow-y-auto">
        {arrivals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">⏳</div>
            <div>도착 정보가 없습니다</div>
          </div>
        ) : type === 'bus' ? (
          renderBusArrivals(arrivals as BusArrival[])
        ) : (
          renderSubwayArrivals(arrivals as SubwayArrival[])
        )}
      </div>

      {/* 푸터 */}
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center">
        마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
      </div>
    </div>
  )
}
