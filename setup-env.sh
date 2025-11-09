#!/bin/bash

# Codespaces secrets를 .env.local 파일로 변환하는 스크립트
# GitHub Codespaces에서 설정한 secrets를 클라이언트에서 사용할 수 있게 합니다

echo "🔧 환경 변수 설정 중..."

# client/.env.local 파일 생성
cat > client/.env.local << EOF
# 이 파일은 자동 생성되었습니다 (setup-env.sh)
# .gitignore에 포함되어 있어 Git에 커밋되지 않습니다

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY:-}

# API Base URL
VITE_API_URL=${VITE_API_URL:-http://localhost:5000/api}

# Kakao API
VITE_KAKAO_REST_API_KEY=${KAKAO_REST_API_KEY:-}
EOF

# server/.env 파일 생성
cat > server/.env << EOF
# 이 파일은 자동 생성되었습니다 (setup-env.sh)
# .gitignore에 포함되어 있어 Git에 커밋되지 않습니다

# 서버 설정
PORT=5000
NODE_ENV=development

# 데이터베이스
DATABASE_URL=${DATABASE_URL:-}

# Redis
REDIS_URL=${REDIS_URL:-redis://localhost:6379}

# API 키들
GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY:-}
KAKAO_REST_API_KEY=${KAKAO_REST_API_KEY:-}
PUBLIC_DATA_API_KEY=${PUBLIC_DATA_API_KEY:-}
OPENWEATHER_API_KEY=${OPENWEATHER_API_KEY:-}
EOF

echo "✅ 환경 변수 파일 생성 완료"
echo ""
echo "📝 설정된 환경 변수:"
if [ -n "$GOOGLE_MAPS_API_KEY" ]; then
  echo "  ✓ GOOGLE_MAPS_API_KEY"
else
  echo "  ✗ GOOGLE_MAPS_API_KEY (미설정)"
fi

if [ -n "$KAKAO_REST_API_KEY" ]; then
  echo "  ✓ KAKAO_REST_API_KEY"
else
  echo "  ✗ KAKAO_REST_API_KEY (미설정)"
fi

echo ""
echo "💡 GitHub Codespaces에서 secrets를 설정하려면:"
echo "   1. 왼쪽 사이드바에서 레포지토리 이름 옆 '...' 클릭"
echo "   2. 'Codespace configuration' 선택"
echo "   3. 'Secrets' 탭에서 환경 변수 추가"
echo "   4. 이 스크립트를 다시 실행: ./setup-env.sh"
