import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 앱 이름 */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl">✈️</div>
            <span className="text-xl font-bold text-primary-600">여행개인화</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              홈
            </Link>
            <Link
              to="/my-trips"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              내 여행
            </Link>
            <Link
              to="/preferences"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              취향 설정
            </Link>
          </nav>

          {/* 사용자 프로필 / 로그인 버튼 */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-primary-600 font-medium transition">
              로그인
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
              회원가입
            </button>
          </div>

          {/* 모바일 햄버거 메뉴 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="메뉴"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                홈
              </Link>
              <Link
                to="/my-trips"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                내 여행
              </Link>
              <Link
                to="/preferences"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                취향 설정
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button className="w-full text-left text-gray-700 hover:text-primary-600 font-medium transition">
                  로그인
                </button>
                <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                  회원가입
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
