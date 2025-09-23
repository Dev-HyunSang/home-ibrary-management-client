<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

export default {
  name: 'ForgotPasswordView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const isLoading = ref(false)
    const message = ref('')
    const errorMessage = ref('')
    const isSubmitted = ref(false)

    const submitForgotPassword = async () => {
      if (!email.value) {
        errorMessage.value = '이메일을 입력해주세요.'
        return
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email.value)) {
        errorMessage.value = '올바른 이메일 형식을 입력해주세요.'
        return
      }

      isLoading.value = true
      errorMessage.value = ''

      try {
        const response = await api.post('/api/users/forgot-password', {
          email: email.value
        })

        if (response.data) {
          isSubmitted.value = true
          message.value = '비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.'
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || '비밀번호 재설정 요청에 실패했습니다.'
      } finally {
        isLoading.value = false
      }
    }

    const goToSignIn = () => {
      router.push('/signin')
    }

    return {
      email,
      isLoading,
      message,
      errorMessage,
      isSubmitted,
      submitForgotPassword,
      goToSignIn,
    }
  },
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 class="text-center text-xl sm:text-2xl text-gray-500 font-bold tracking-tight leading-tight">
        어서오세요. 우리집 도서관입니다.
      </h1>
      <h2 class="mt-4 sm:mt-5 text-center text-xl sm:text-2xl/9 font-bold tracking-tight text-gray-500">
        {{ isSubmitted ? '이메일 전송 완료' : '비밀번호 찾기' }}
      </h2>
    </div>

    <div class="mt-8 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- 성공 메시지 -->
      <div
        v-if="isSubmitted && message"
        class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm">{{ message }}</p>
          </div>
        </div>
      </div>

      <!-- 에러 메시지 -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        {{ errorMessage }}
      </div>

      <!-- 폼 -->
      <div v-if="!isSubmitted">
        <form @submit.prevent="submitForgotPassword" class="space-y-5 sm:space-y-6">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-500">
              이메일 주소
            </label>
            <div class="mt-2">
              <input
                id="email"
                v-model="email"
                type="email"
                name="email"
                required
                autocomplete="email"
                placeholder="가입한 이메일을 입력하세요"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-500/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            <p class="mt-2 text-sm text-gray-600">
              가입할 때 사용한 이메일 주소를 입력하시면 임시 비밀번호를 보내드립니다.
            </p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">전송 중...</span>
              <span v-else>비밀번호 재설정 링크 전송</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 완료 후 버튼 -->
      <div v-else class="space-y-4">
        <button
          @click="goToSignIn"
          class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>

      <!-- 하단 링크 -->
      <p class="mt-8 sm:mt-10 text-center text-sm/6 text-gray-400">
        비밀번호가 기억나셨나요?
        <router-link to="/signin" class="font-semibold text-indigo-400 hover:text-indigo-300">
          로그인 하기
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped></style>