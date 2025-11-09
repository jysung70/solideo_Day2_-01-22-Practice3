import React, { useState, useEffect, useRef } from 'react'
import { Location } from '@types/index'
import { searchKoreanCity, getSuggestions } from '@/utils/koreanCities'

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
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [useGoogleAPI, setUseGoogleAPI] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 최근 검색 기록 불러오기
    const saved = localStorage.getItem('recentLocationSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (!inputRef.current) return

    // Google Places Autocomplete 초기화 시도
    const initAutocomplete = async () => {
      try {
        if (!window.google?.maps?.places) {
          console.log('Google Maps API 없음 - 한국 도시 데이터 사용')
          setUseGoogleAPI(false)
          return
        }

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current!, {
          componentRestrictions: { country: 'kr' },
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
          saveToRecentSearches(location.address)
          setShowSuggestions(false)
        })

        setUseGoogleAPI(true)
        console.log('Google Maps API 사용 활성화')
      } catch (error) {
        console.error('Autocomplete 초기화 오류:', error)
        setUseGoogleAPI(false)
      }
    }

    // Google Maps API 로드 대기
    const checkAndInit = () => {
      if (window.google?.maps?.places) {
        initAutocomplete()
      } else {
        // 1초 후에도 없으면 한국 도시 데이터 사용
        setTimeout(() => {
          if (!window.google?.maps?.places) {
            setUseGoogleAPI(false)
          }
        }, 1000)
      }
    }

    checkAndInit()

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const saveToRecentSearches = (address: string) => {
    const updated = [address, ...recentSearches.filter((s) => s !== address)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentLocationSearches', JSON.stringify(updated))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    if (!newValue) {
      onChange(null)
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Google API가 없을 때만 수동 자동완성 사용
    if (!useGoogleAPI) {
      const newSuggestions = getSuggestions(newValue)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !useGoogleAPI) {
      e.preventDefault()
      handleManualSubmit()
    }
  }

  const handleManualSubmit = () => {
    if (!inputValue.trim()) return

    const location = searchKoreanCity(inputValue)
    if (location) {
      onChange(location)
      saveToRecentSearches(location.address)
      setInputValue(location.address)
      setShowSuggestions(false)
      console.log('✅ 위치 설정:', location)
    } else {
      // 도시를 찾지 못한 경우 기본 좌표 사용
      const fallbackLocation: Location = {
        address: inputValue,
        lat: 37.5665, // 서울 기본 좌표
        lng: 126.9780,
      }
      onChange(fallbackLocation)
      saveToRecentSearches(inputValue)
      setShowSuggestions(false)
      console.warn('⚠️ 도시를 찾지 못해 기본 좌표 사용:', fallbackLocation)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    const location = searchKoreanCity(suggestion)
    if (location) {
      setInputValue(location.address)
      onChange(location)
      saveToRecentSearches(location.address)
      setShowSuggestions(false)
      console.log('✅ 위치 설정:', location)
    }
  }

  const handleRecentClick = (address: string) => {
    setInputValue(address)
    const location = searchKoreanCity(address)
    if (location) {
      onChange(location)
      console.log('✅ 최근 검색에서 선택:', location)
    }
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
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (!useGoogleAPI && inputValue) {
              const newSuggestions = getSuggestions(inputValue)
              setSuggestions(newSuggestions)
              setShowSuggestions(newSuggestions.length > 0)
            }
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition`}
        />

        {/* 아이콘 */}
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

        {/* 자동완성 제안 (Google API 없을 때만) */}
        {!useGoogleAPI && showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="block w-full text-left px-4 py-2 hover:bg-primary-50 transition"
              >
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">📍</span>
                  <span className="font-medium text-gray-900">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* API 상태 표시 */}
      {!useGoogleAPI && (
        <p className="text-xs text-gray-500">
          💡 한국 주요 도시 입력 가능 (예: 서울, 대전, 부산 등) - 엔터를 눌러 선택하세요
        </p>
      )}

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
