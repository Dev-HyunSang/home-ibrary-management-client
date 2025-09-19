import axios from 'axios'

// 백엔드 API 베이스 URL (필요에 따라 수정하세요)
const API_BASE_URL = 'http://localhost:3000'
// 또는 실제 백엔드 URL

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 세션 쿠키를 자동으로 포함
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.method?.toUpperCase(), config.url)
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
