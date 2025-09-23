<script>
export default {
  name: 'ReviewList',
  props: {
    reviews: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 3
    }
  },
  computed: {
    displayedReviews() {
      return this.reviews.slice(0, this.limit)
    }
  }
}
</script>

<template>
  <div class="bg-white shadow rounded-lg" v-if="reviews && reviews.length > 0">
    <div class="px-4 py-4 sm:py-5 sm:px-6">
      <h3 class="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">최근 리뷰</h3>
      <div class="space-y-3 sm:space-y-4">
        <div
          v-for="review in displayedReviews"
          :key="review.id"
          class="border-l-4 border-blue-400 pl-3 sm:pl-4"
        >
          <div class="mb-2">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 space-y-1 sm:space-y-0">
              <h4 class="text-sm font-semibold text-gray-900 line-clamp-2 pr-2">{{ review.book_title }}</h4>
              <span class="text-xs text-gray-500 flex-shrink-0">
                {{ new Date(review.created_at).toLocaleDateString('ko-KR') }}
              </span>
            </div>
            <p class="text-xs text-gray-600 mb-2 truncate">저자: {{ review.book_author }}</p>
            <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <span class="text-sm font-medium text-gray-900">평점:</span>
              <div class="flex items-center">
                <span v-for="n in 5" :key="n" class="text-yellow-400 text-sm">
                  {{ n <= review.rating ? '★' : '☆' }}
                </span>
                <span class="ml-1 text-sm text-gray-600">({{ review.rating }}/5)</span>
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {{ review.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>