<script>
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const { register, isLoading } = useAuth()
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const name = ref('')
    const isPublic = ref(true)
    const errorMessage = ref('')

    const submitRegister = async () => {
      if (!name.value || !email.value || !password.value || !confirmPassword.value) {
        errorMessage.value = '모든 필드를 입력해주세요.'
        return
      }

      // 닉네임 유효성 검사
      const nicknamePattern = /^[a-z0-9._]+$/
      if (!nicknamePattern.test(name.value)) {
        errorMessage.value = '닉네임은 소문자, 숫자, 점(.), 언더스코어(_)만 사용할 수 있습니다.'
        return
      }

      if (password.value !== confirmPassword.value) {
        errorMessage.value = '비밀번호가 일치하지 않습니다.'
        return
      }

      if (password.value.length < 6) {
        errorMessage.value = '비밀번호는 최소 6자 이상이어야 합니다.'
        return
      }

      errorMessage.value = ''

      const result = await register({
        'nick_name': name.value,
        'email': email.value,
        'password': password.value,
        'is_published': isPublic.value,
      })

      if (result.success) {
        console.log('회원가입 성공:', result.data)
        router.push('/signin')
      } else {
        errorMessage.value = result.error
      }
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      isPublic,
      isLoading,
      errorMessage,
      submitRegister,
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
      <h2 class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-500">회원가입</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitRegister" class="space-y-6">
        <div>
          <label for="name" class="block text-sm/6 font-medium text-gray-500">닉네임</label>
          <div class="mt-2">
            <input
              id="name"
              v-model="name"
              type="text"
              name="name"
              required
              autocomplete="name"
              placeholder="소문자, 숫자, ., _ 만 사용 가능"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-500/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

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
          <label for="password" class="block text-sm/6 font-medium text-gray-500">Password</label>
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              required
              autocomplete="new-password"
              placeholder="비밀번호를 입력하세요"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-500/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-500">비밀번호 확인</label>
          <div class="mt-2">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              autocomplete="new-password"
              placeholder="비밀번호를 다시 입력하세요"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-500/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-500 mb-3">계정 공개 설정</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="isPublic"
                type="radio"
                name="privacy"
                :value="true"
                class="mr-2 text-indigo-500 focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-500">공개 계정 - 다른 사용자들이 내 도서관을 볼 수 있습니다</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="isPublic"
                type="radio"
                name="privacy"
                :value="false"
                class="mr-2 text-indigo-500 focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-500">비공개 계정 - 나만 내 도서관을 볼 수 있습니다</span>
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">회원가입 중...</span>
            <span v-else>회원가입</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-400">
        이미 계정이 있으신가요?
        <router-link to="/login" class="font-semibold text-indigo-400 hover:text-indigo-300">로그인 하기</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped></style>