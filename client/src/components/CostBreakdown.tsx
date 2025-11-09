import React, { useState } from 'react'
import { CostBreakdown as CostBreakdownType } from '@/types/transit'

interface CostBreakdownProps {
  costBreakdown: CostBreakdownType
  participants?: number
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  costBreakdown,
  participants = 1,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['transportation', 'food', 'activities'])
  )

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('ko-KR')
  }

  const renderSection = (
    title: string,
    icon: string,
    sectionKey: string,
    items: { label: string; amount: number }[],
    total: number
  ) => {
    const isExpanded = expandedSections.has(sectionKey)

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">{icon}</span>
            <span className="font-semibold text-gray-900">{title}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-gray-900 mr-2">
              {formatCurrency(total)}원
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isExpanded ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4">
            <div className="space-y-2 bg-gray-50 rounded-lg p-3">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">├─ {item.label}</span>
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(item.amount)}원
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-semibold">
                <span className="text-gray-700">소계</span>
                <span className="text-primary-600">
                  {formatCurrency(total)}원
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">💰</span>
          <h3 className="text-lg font-bold">예상 비용</h3>
        </div>
        {participants > 1 && (
          <div className="text-sm opacity-90">
            {participants}명 기준
          </div>
        )}
      </div>

      {/* 비용 섹션들 */}
      <div>
        {/* 교통비 */}
        {renderSection(
          '교통비',
          '🚇',
          'transportation',
          [
            { label: '버스', amount: costBreakdown.transportation.bus },
            { label: '지하철', amount: costBreakdown.transportation.subway },
            { label: '기차', amount: costBreakdown.transportation.train },
            { label: '택시', amount: costBreakdown.transportation.taxi },
          ],
          costBreakdown.transportation.total
        )}

        {/* 식비 */}
        {renderSection(
          `식비 (${participants}인 기준)`,
          '🍽️',
          'food',
          [
            { label: '아침', amount: costBreakdown.food.breakfast },
            { label: '점심', amount: costBreakdown.food.lunch },
            { label: '저녁', amount: costBreakdown.food.dinner },
            { label: '간식', amount: costBreakdown.food.snacks },
          ],
          costBreakdown.food.total
        )}

        {/* 활동비 */}
        {renderSection(
          '기타',
          '🎭',
          'activities',
          [
            { label: '입장료', amount: costBreakdown.activities.admission },
            { label: '체험', amount: costBreakdown.activities.experiences },
            { label: '기념품', amount: costBreakdown.activities.souvenirs },
          ],
          costBreakdown.activities.total
        )}

        {/* 숙박비 (있는 경우) */}
        {costBreakdown.accommodation && (
          <div className="border-b border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏨</span>
                  <span className="font-semibold text-gray-900">숙박비</span>
                </div>
                <span className="font-bold text-gray-900">
                  {formatCurrency(costBreakdown.accommodation.total)}원
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {costBreakdown.accommodation.nights}박
                  </span>
                  <span className="text-gray-900">
                    {formatCurrency(costBreakdown.accommodation.pricePerNight)}원 × {costBreakdown.accommodation.nights}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 총합 */}
      <div className="bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">총 예상 비용</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(costBreakdown.total)}원
          </span>
        </div>
        {participants > 1 && (
          <div className="mt-2 text-sm text-gray-600 text-right">
            1인당 약 {formatCurrency(Math.round(costBreakdown.total / participants))}원
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 p-3 text-xs text-blue-700">
        <div className="flex items-start">
          <svg
            className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p>
            예상 비용은 평균 가격을 기준으로 계산되었습니다. 실제 비용은 선택한 장소와 상황에 따라 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
