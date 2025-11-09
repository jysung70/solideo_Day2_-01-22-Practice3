import { useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export const useGoogleMapsLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.warn('⚠️ Google Maps API 키가 설정되지 않았습니다. 지도 기능이 비활성화됩니다.')
      console.warn('📝 client/.env 파일에서 VITE_GOOGLE_MAPS_API_KEY를 설정하세요.')
      setIsLoaded(false)
      return
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    })

    loader
      .load()
      .then(() => {
        setIsLoaded(true)
        console.log('Google Maps API 로드 완료')
      })
      .catch((err) => {
        console.error('Google Maps API 로드 실패:', err)
        setError(err)
      })
  }, [])

  return { isLoaded, error }
}
