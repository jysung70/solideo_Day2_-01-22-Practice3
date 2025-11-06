import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-600 mb-4">
                  여행 개인화 앱
                </h1>
                <p className="text-gray-600">
                  Travel Personalization App
                </p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
