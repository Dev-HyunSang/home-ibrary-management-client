import axios from 'axios'

// 백엔드 API 베이스 URL - 환경에 따라 동적으로 설정
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? `http://${window.location.hostname}:3000`  // 개발환경: 현재 접속 호스트의 3000포트
  : 'http://localhost:3000'  // 프로덕션: 실제 서버 URL로 변경 필요

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.method?.toUpperCase(), config.url)

    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('API 응답:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API 오류:', error.response?.status, error.config?.url)

    // 401 Unauthorized - 인증 실패
    if (error.response?.status === 401) {
      // 로그인이 필요한 상황
      console.log('인증이 필요합니다. 로그인 페이지로 이동합니다.')
      // Vue Router로 로그인 페이지로 리다이렉트 (필요시)
    }

    return Promise.reject(error)
  },
)

export default api
