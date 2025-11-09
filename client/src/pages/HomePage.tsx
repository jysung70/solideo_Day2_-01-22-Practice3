import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TravelInputCard, TravelFormData } from '@components/TravelInputCard'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleTravelSubmit = (data: TravelFormData) => {
    console.log('🚀 [HomePage] 여행 계획 데이터:', data)
    console.log('🚀 [HomePage] origin:', data.origin)
    console.log('🚀 [HomePage] destination:', data.destination)

    // 사용자 입력 데이터를 지도 페이지로 전달
    navigate('/map', {
      state: {
        origin: data.origin,
        destination: data.destination,
        departureDate: data.departureDate,
        departureTime: data.departureTime,
        duration: data.duration,
        participants: data.participants,
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            당신만의 완벽한 여행을
            <br />
            계획하세요
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            실시간 교통정보 + 맞춤 추천으로 스마트하게
          </p>

          {/* 특징 배지 */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              🚌 실시간 대중교통
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              🍽️ 맞춤 맛집 추천
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              🏖️ 관광지 추천
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
              💰 비용 분석
            </span>
          </div>
        </div>

        {/* 여행 입력 카드 */}
        <TravelInputCard onSubmit={handleTravelSubmit} />
      </section>

      {/* 추가 정보 섹션 */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            여행 계획이 더욱 쉬워집니다
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 기능 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                스마트 경로 추천
              </h3>
              <p className="text-gray-600">
                최단 시간, 최소 비용, 최소 환승 등 다양한 옵션으로 최적의 경로를 찾아드립니다.
              </p>
            </div>

            {/* 기능 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                개인 맞춤 추천
              </h3>
              <p className="text-gray-600">
                취향, 예산, 날씨를 고려한 맛집, 관광지, 숙소를 추천해드립니다.
              </p>
            </div>

            {/* 기능 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                실시간 정보
              </h3>
              <p className="text-gray-600">
                버스, 지하철, 기차의 실시간 도착 정보로 완벽한 일정 관리가 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 여행 개인화 앱. All rights reserved.</p>
          <p className="mt-2">
            Made with ❤️ for travelers
          </p>
        </div>
      </footer>
    </div>
  )
}
