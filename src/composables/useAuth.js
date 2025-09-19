import { ref, computed } from 'vue'
import api from '@/api'

// 전역 사용자 상태
const user = ref(null)
const isLoading = ref(false)

export function useAuth() {
  // 로그인 상태 확인
  const isLoggedIn = computed(() => !!user.value)

  // 현재 사용자 정보 확인 (세션 검증)
  const checkAuth = async () => {
    isLoading.value = true
    try {
      const response = await api.post('/api/users/me') // 또는 /api/user, /api/profile
      user.value = response.data
      return true
    } catch (error) {
      if (error.response && error.response.status !== 401) {
        console.error('사용자가 로그인을 하지 않았습니다.')
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
      const response = await api.post('/api/users/login', { email, password })
      user.value = response.data.user || response.data // 백엔드 응답 구조에 따라 조정
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
      await api.post('/api/logout')
    } catch (error) {
      console.error('로그아웃 요청 실패:', error)
    } finally {
      user.value = null
      isLoading.value = false
    }
  }

  // 회원가입 처리 (필요시)
  const register = async (userData) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/register', userData)
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
