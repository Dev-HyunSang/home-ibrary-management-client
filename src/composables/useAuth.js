import { ref, computed } from 'vue'
import api from '@/api'

// 전역 사용자 상태
const user = ref(null)
const isLoading = ref(false)

export function useAuth() {
  // 로그인 상태 확인
  const isLoggedIn = computed(() => !!user.value)

  // 현재 사용자 정보 확인 (토큰 검증)
  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return false
    }

    isLoading.value = true
    try {
      const response = await api.post('/api/users/me') // 또는 /api/user, /api/profile
      user.value = response.data
      return true
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // 토큰이 만료된 경우 제거
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        user.value = null
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 로그인 처리
  const login = async (email, password) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/users/signin', { email, password })

      // JWT 토큰 저장
      const { access_token, refresh_token, user: userData } = response.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      // 사용자 정보 저장
      user.value = userData
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '로그인에 실패했습니다.',
      }
    } finally {
      isLoading.value = false
    }
  }

  // 로그아웃 처리
  const logout = async () => {
    isLoading.value = true
    try {
      await api.post('/api/users/signout')
    } catch (error) {
      console.error('로그아웃 요청 실패:', error)
    } finally {
      // 토큰 제거
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      user.value = null
      isLoading.value = false
    }
  }

  // 회원가입 처리 (필요시)
  const register = async (userData) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/users/signup', userData)
      user.value = response.data.user || response.data
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '회원가입에 실패했습니다.',
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: computed(() => user.value),
    isLoggedIn,
    isLoading: computed(() => isLoading.value),
    checkAuth,
    login,
    logout,
    register,
  }
}
