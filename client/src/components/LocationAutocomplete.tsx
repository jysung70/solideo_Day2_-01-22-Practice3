import React, { useState, useEffect, useRef } from 'react'
import { Location } from '@types/index'

interface LocationAutocompleteProps {
  value: Location | null
  onChange: (location: Location | null) => void
  placeholder?: string
  label?: string
  error?: string
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = '주소를 입력하세요',
  label,
  error,
}) => {
  const [inputValue, setInputValue] = useState(value?.address || '')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    // 최근 검색 기록 불러오기
    const saved = localStorage.getItem('recentLocationSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (!inputRef.current) return

    // Google Places Autocomplete 초기화
    const initAutocomplete = async () => {
      try {
        // Google Maps API가 로드될 때까지 대기
        if (!window.google?.maps?.places) {
          console.warn('Google Maps API가 아직 로드되지 않았습니다.')
          return
        }

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current!, {
          componentRestrictions: { country: 'kr' }, // 한국으로 제한
          fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id'],
        })

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current!.getPlace()

          if (!place.geometry?.location) {
            console.warn('선택한 장소에 위치 정보가 없습니다.')
            return
          }

          const location: Location = {
            address: place.formatted_address || place.name || '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            placeId: place.place_id,
          }

          setInputValue(location.address)
          onChange(location)

          // 최근 검색에 추가
          const updated = [
            location.address,
            ...recentSearches.filter((s) => s !== location.address),
          ].slice(0, 5)
          setRecentSearches(updated)
          localStorage.setItem('recentLocationSearches', JSON.stringify(updated))
        })
      } catch (error) {
        console.error('Autocomplete 초기화 오류:', error)
      }
    }

    // Google Maps API 로드 대기
    const checkAndInit = () => {
      if (window.google?.maps?.places) {
        initAutocomplete()
      } else {
        setTimeout(checkAndInit, 100)
      }
    }

    checkAndInit()

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (!e.target.value) {
      onChange(null)
    }
  }

  const handleRecentClick = (address: string) => {
    setInputValue(address)
    // 최근 검색에서 선택 시 실제 위치 정보는 없으므로 주소만 설정
    // 실제로는 Geocoding API를 사용해야 하지만, 여기서는 간단히 처리
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition`}
        />

        {/* 최근 검색 아이콘 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* 최근 검색 기록 */}
      {recentSearches.length > 0 && !inputValue && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-2">최근 검색</p>
          <div className="space-y-1">
            {recentSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => handleRecentClick(search)}
                className="block w-full text-left text-sm text-gray-700 hover:text-primary-600 py-1 px-2 rounded hover:bg-white transition"
              >
                📍 {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
