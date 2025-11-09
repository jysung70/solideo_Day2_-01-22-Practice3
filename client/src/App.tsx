import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@components/Header'
import { HomePage } from '@pages/HomePage'
import { MapPage } from '@pages/MapPage'
import { useGoogleMapsLoader } from '@hooks/useGoogleMapsLoader'

function App() {
  // Google Maps API 로드
  const { isLoaded, error } = useGoogleMapsLoader()

  if (error) {
    console.error('Google Maps 로드 오류:', error)
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/my-trips" element={
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  내 여행
                </h1>
                <p className="text-gray-600">개발 중입니다...</p>
              </div>
            </div>
          } />
          <Route path="/preferences" element={
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  취향 설정
                </h1>
                <p className="text-gray-600">개발 중입니다...</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
