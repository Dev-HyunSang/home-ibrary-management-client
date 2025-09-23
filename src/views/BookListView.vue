<script>
import { useAuth } from '@/composables/useAuth'
import { useBook } from '@/composables/useBook'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

export default {
  name: 'BookListView',
  setup() {
    const { user, logout } = useAuth()
    const { books, isLoading, fetchBooks, deleteBook } = useBook()
    const router = useRouter()

    onMounted(() => {
      fetchBooks()
    })

    const handleLogout = async () => {
      await logout()
      router.push('/signin')
    }

    const goToDashboard = () => {
      router.push('/dashboard')
    }

    const handleDeleteBook = async (bookId) => {
      if (confirm('정말로 이 책을 삭제하시겠습니까?')) {
        const result = await deleteBook(bookId)
        if (result.success) {
          console.log('책이 삭제되었습니다.')
        } else {
          alert(result.error)
        }
      }
    }

    // 도서 통계 계산
    const bookStats = computed(() => {
      if (!books.value || books.value.length === 0) {
        return {
          total: 0,
          reading: 0,
          completed: 0,
        }
      }

      return {
        total: books.value.length,
        reading: books.value.filter(book => !book.complated_at).length,
        completed: books.value.filter(book => book.complated_at).length,
      }
    })

    return {
      user,
      books,
      isLoading,
      bookStats,
      handleLogout,
      goToDashboard,
      handleDeleteBook,
    }
  },
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          <div class="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
            <button
              @click="goToDashboard"
              class="text-indigo-600 hover:text-indigo-500 font-medium text-sm sm:text-base self-start"
            >
              ← 대시보드로 돌아가기
            </button>
            <h1 class="text-xl sm:text-3xl font-bold tracking-tight text-gray-900">등록된 도서 목록</h1>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <span class="text-sm sm:text-base text-gray-700 truncate max-w-full sm:max-w-none">
              환영합니다, {{ user?.nick_name || user?.email || '사용자' }}님
            </span>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-4 rounded-md text-sm font-medium w-full sm:w-auto"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="mx-auto max-w-7xl py-4 sm:py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-4 sm:py-6 sm:px-0">
        <!-- 통계 요약 -->
        <div class="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">전체 도서</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookStats.total }}권</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">읽는 중</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookStats.reading }}권</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">다 읽음</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookStats.completed }}권</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p class="mt-2 text-gray-600">도서 목록을 불러오는 중...</p>
        </div>

        <!-- 도서가 없는 경우 -->
        <div v-else-if="!books || books.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">등록된 도서가 없습니다</h3>
          <p class="mt-1 text-sm text-gray-500">대시보드에서 새로운 도서를 추가해보세요.</p>
        </div>

        <!-- 도서 목록 -->
        <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li v-for="book in books" :key="book.id" class="px-4 sm:px-6 py-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div class="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  <div class="flex-shrink-0">
                    <img
                      v-if="book.image"
                      :src="book.image"
                      :alt="book.title"
                      class="h-16 w-12 sm:h-20 sm:w-16 object-cover rounded"
                    />
                    <div
                      v-else
                      class="h-16 w-12 sm:h-20 sm:w-16 bg-gray-200 rounded flex items-center justify-center"
                    >
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-base sm:text-lg font-medium text-gray-900 line-clamp-2">{{ book.title }}</h3>
                    <p class="text-sm text-gray-600 truncate">저자: {{ book.author }}</p>
                    <p class="text-sm text-gray-500 truncate">출판사: {{ book.publisher }}</p>
                    <div class="mt-2 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start',
                          book.complated_at
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ book.complated_at ? '읽기 완료' : '읽는 중' }}
                      </span>
                      <span class="text-xs text-gray-500">
                        등록일: {{ book.registered_at ? new Date(book.registered_at).toLocaleDateString('ko-KR') : '-' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-shrink-0 self-end sm:self-center">
                  <button
                    @click="handleDeleteBook(book.id)"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto justify-center"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>