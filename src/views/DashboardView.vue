<script>
import { useAuth } from '@/composables/useAuth'
import { useBook } from '@/composables/useBook'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import BookAdd from '@/components/BookAdd.vue'
import ReviewList from '@/components/ReviewList.vue'

export default {
  name: 'DashboardView',
  components: {
    BookAdd,
    ReviewList
  },
  setup() {
    const { user, logout } = useAuth()
    const { books, reviews, fetchBooks, fetchReviews } = useBook()
    const router = useRouter()

    fetchBooks()
    fetchReviews()

    const handleLogout = async () => {
      await logout()
      router.push('/signin')
    }

    // 도서 통계 계산
    const bookStats = computed(() => {
      if (!books.value || books.value.length === 0) {
        return {
          total: 0,
          reading: 0,
          completed: 0,
          reviewed: 0,
          favorite: 0
        }
      }

      // 리뷰된 도서의 고유 book_id 개수 계산
      const reviewedBookIds = new Set(reviews.value?.map(review => review.book_id) || [])

      return {
        total: books.value.length,
        reading: books.value.filter(book => !book.complated_at).length,
        completed: books.value.filter(book => book.complated_at).length,
        reviewed: reviewedBookIds.size,
        favorite: Math.floor(books.value.length * 0.3)  // 임시로 30%로 가정 (즐겨찾기 API 필요)
      }
    })

    return {
      user,
      books,
      reviews,
      bookStats,
      handleLogout,
    }
  },
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">우리집 도서관</h1>
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
        <div class="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- 도서 통계 카드 -->
          <router-link to="/books" class="block">
            <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">등록된 총 도서 수</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ bookStats.total }}권</dd>
                    </dl>
                  </div>
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </router-link>

          <!-- 대출 중인 도서 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">읽고 있는 중인 도서</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookStats.reading }}권</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <!-- 다 읽은 도서 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">다 읽은 도서</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookStats.completed }}권</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- 리뷰한 도서 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">리뷰한 도서</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookStats.reviewed }}권</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <!-- 즐겨찾기 도서 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">즐겨찾기</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookStats.favorite }}권</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 도서 추가 -->
        <div class="mt-6 sm:mt-8">
          <BookAdd />
        </div>

        <!-- 최근 리뷰 -->
        <div class="mt-6 sm:mt-8">
          <ReviewList :reviews="reviews" :limit="3" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
