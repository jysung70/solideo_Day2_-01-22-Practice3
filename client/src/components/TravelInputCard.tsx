import React, { useState } from 'react'
import { LocationAutocomplete } from './LocationAutocomplete'
import { DateTimePicker } from './DateTimePicker'
import { Button } from './Button'
import { Location, TravelDuration } from '@types/index'

interface TravelInputCardProps {
  onSubmit: (data: TravelFormData) => void
}

export interface TravelFormData {
  origin: Location | null
  destination: Location | null
  departureDate: Date | null
  departureTime: string
  duration: number
  participants: number
}

export const TravelInputCard: React.FC<TravelInputCardProps> = ({ onSubmit }) => {
  const [origin, setOrigin] = useState<Location | null>(null)
  const [destination, setDestination] = useState<Location | null>(null)
  const [departureDate, setDepartureDate] = useState<Date | null>(null)
  const [departureTime, setDepartureTime] = useState('')
  const [durationType, setDurationType] = useState<TravelDuration>('daytrip')
  const [customDuration, setCustomDuration] = useState(1)
  const [participants, setParticipants] = useState(2)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const durationMap: Record<TravelDuration, number> = {
    daytrip: 0,
    '1night': 1,
    '2nights': 2,
    custom: customDuration,
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!origin) {
      newErrors.origin = '출발지를 입력해주세요'
    }

    if (!destination) {
      newErrors.destination = '도착지를 입력해주세요'
    }

    if (!departureDate) {
      newErrors.departureDate = '출발 날짜를 선택해주세요'
    }

    if (!departureTime) {
      newErrors.departureTime = '출발 시간을 선택해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formData: TravelFormData = {
        origin,
        destination,
        departureDate,
        departureTime,
        duration: durationMap[durationType],
        participants,
      }

      await onSubmit(formData)
    } catch (error) {
      console.error('여행 계획 제출 오류:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleParticipantsChange = (delta: number) => {
    setParticipants((prev) => Math.max(1, Math.min(20, prev + delta)))
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🚀 여행 정보 입력
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          여행 계획을 위한 기본 정보를 입력해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 출발지 */}
        <div>
          <LocationAutocomplete
            value={origin}
            onChange={setOrigin}
            placeholder="출발지 입력 (예: 서울역)"
            label="📍 출발지"
            error={errors.origin}
          />
        </div>

        {/* 도착지 */}
        <div>
          <LocationAutocomplete
            value={destination}
            onChange={setDestination}
            placeholder="도착지 입력 (예: 부산역)"
            label="📍 도착지"
            error={errors.destination}
          />
        </div>

        {/* 출발 시간 */}
        <div>
          <DateTimePicker
            selectedDate={departureDate}
            selectedTime={departureTime}
            onDateChange={setDepartureDate}
            onTimeChange={setDepartureTime}
            label="🕐 출발 시간"
            error={errors.departureDate || errors.departureTime}
          />
        </div>

        {/* 여행 기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📅 여행 기간
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setDurationType('daytrip')}
              className={`px-4 py-3 rounded-lg border-2 transition font-medium ${
                durationType === 'daytrip'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              당일치기
            </button>
            <button
              type="button"
              onClick={() => setDurationType('1night')}
              className={`px-4 py-3 rounded-lg border-2 transition font-medium ${
                durationType === '1night'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              1박2일
            </button>
            <button
              type="button"
              onClick={() => setDurationType('2nights')}
              className={`px-4 py-3 rounded-lg border-2 transition font-medium ${
                durationType === '2nights'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              2박3일
            </button>
            <button
              type="button"
              onClick={() => setDurationType('custom')}
              className={`px-4 py-3 rounded-lg border-2 transition font-medium ${
                durationType === 'custom'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              직접입력
            </button>
          </div>

          {durationType === 'custom' && (
            <div className="mt-3">
              <input
                type="number"
                min="1"
                max="30"
                value={customDuration}
                onChange={(e) => setCustomDuration(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="여행 기간 (일)"
              />
            </div>
          )}
        </div>

        {/* 인원 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">👤 인원</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleParticipantsChange(-1)}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition font-bold text-lg"
            >
              -
            </button>
            <span className="text-xl font-semibold text-gray-800 min-w-[60px] text-center">
              {participants}명
            </span>
            <button
              type="button"
              onClick={() => handleParticipantsChange(1)}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition font-bold text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '여행 계획 시작하기'}
          </Button>
        </div>
      </form>
    </div>
  )
}
