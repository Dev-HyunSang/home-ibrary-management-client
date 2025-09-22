import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    name: 'index',
    path: '/',
    redirect: '/signin',
  },
  {
    name: 'SignIn',
    path: '/signin',
    component: () => import('@/views/SignInView.vue'),
  },
  {
    name: 'SignUp',
    path: '/signup',
    component: () => import('@/views/SignUpView.vue'),
  },
  {
    name: 'ForgotPassword',
    path: '/forgot-password',
    // component: () => import('@/views/ForgotPasswordView.vue'),
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }, // 인증이 필요한 페이지 표시
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

// 라우터 가드 설정
router.beforeEach(async (to, from, next) => {
  const { checkAuth, isLoggedIn } = useAuth()

  // 인증이 필요한 페이지인지 확인
  if (to.meta.requiresAuth) {
    // 로그인 상태가 아니면 세션 확인
    if (!isLoggedIn.value) {
      const isAuthenticated = await checkAuth()

      if (!isAuthenticated) {
        // 인증되지 않음 - 로그인 페이지로 리다이렉트
        next('/login')
        return
      }
    }
  }

  // 로그인 페이지인데 이미 로그인된 경우
  if (to.path === '/login' && isLoggedIn.value) {
    next('/dashboard')
    return
  }

  next()
})

export default router
