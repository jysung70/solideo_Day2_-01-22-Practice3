import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface DateTimePickerProps {
  selectedDate: Date | null
  selectedTime: string
  onDateChange: (date: Date | null) => void
  onTimeChange: (time: string) => void
  label?: string
  error?: string
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  label = '출발 시간',
  error,
}) => {
  const today = new Date()

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return [`${hour}:00`, `${hour}:30`]
  }).flat()

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 날짜 선택 */}
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            minDate={today}
            dateFormat="yyyy년 MM월 dd일"
            locale={ko}
            placeholderText="날짜 선택"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            wrapperClassName="w-full"
          />
        </div>

        {/* 시간 선택 */}
        <div>
          <select
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          >
            <option value="">시간 선택</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      {selectedDate && (
        <p className="text-sm text-gray-500">
          선택된 날짜: {format(selectedDate, 'yyyy년 MM월 dd일 (EEE)', { locale: ko })}
          {selectedTime && ` ${selectedTime}`}
        </p>
      )}
    </div>
  )
}
