<script>
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'SignInView',
  setup() {
    const router = useRouter()
    const { login, isLoading } = useAuth()
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')

    const submitLogin = async () => {
      if (!email.value || !password.value) {
        errorMessage.value = '이메일과 비밀번호를 입력해주세요.'
        return
      }

      errorMessage.value = ''

      const result = await login(email.value, password.value)

      if (result.success) {
        console.log('로그인 성공:', result.data)
        // 로그인 성공 시 메인 페이지 또는 대시보드로 이동
        router.push('/dashboard') // 또는 원하는 페이지
      } else {
        errorMessage.value = result.error
      }
    }

    return {
      email,
      password,
      isLoading,
      errorMessage,
      submitLogin,
    }
  },
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 class="text-center text-2xl text-gray-500 font-bold tracking-tight">
        어서오세요. 우리집 도서관입니다.
      </h1>
      <h2 class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-500">로그인</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- 에러 메시지 표시 -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-500">Email address</label>
          <div class="mt-2">
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              required
              autocomplete="email"
              placeholder="이메일을 입력하세요"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-500/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-500">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300"
                >비밀번호을 잊어버리셨나요?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              required
              autocomplete="current-password"
              placeholder="비밀번호를 입력하세요"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-500/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">로그인 중...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-400">
        아직 계정이 없으신가요?
        <router-link to="/register" class="font-semibold text-indigo-400 hover:text-indigo-300">회원가입 하기</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
