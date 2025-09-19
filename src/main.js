import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

app.use(router)

// 앱 시작 시 인증 상태 확인
const { checkAuth } = useAuth()
checkAuth().then(() => {
  app.mount('#app')
})
