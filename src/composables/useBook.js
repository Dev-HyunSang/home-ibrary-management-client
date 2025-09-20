import {ref, computed} from 'vue'
import api from '@/api'

// 전역 도서 상태
const books = ref([])
const reviews = ref([])
const isLoading = ref(false)

export function useBook() {
  // 도서 목록 가져오기
  const fetchBooks = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/api/books/get')
      if (response.data.is_success && response.data.data) {
        books.value = response.data.data
        console.log('도서 목록:', books.value)
      } else {
        console.error('API 응답이 성공하지 못했습니다:', response.data)
      }
    } catch (error) {
      console.error('도서 목록을 가져오는 데 실패했습니다:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 도서 추가
  const addBook = async (bookData) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/books/add', bookData)
      books.value.push(response.data)
      return {success: true, data: response.data}
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '도서 추가에 실패했습니다.',
      }
    } finally {
      isLoading.value = false
    }
  }

  // 도서 삭제
  const deleteBook = async (bookId) => {
    isLoading.value = true
    try {
      await api.delete(`/api/books/delete/${bookId}`)
      books.value = books.value.filter((book) => book.id !== bookId)
      return {success: true}
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || '도서 삭제에 실패했습니다.',
      }
    }  finally {
      isLoading.value = false
    }
  }

  // 리뷰 목록 가져오기
  const fetchReviews = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/api/books/reviews/get')
      if (response.data.is_success && response.data.data) {
        reviews.value = response.data.data
        console.log('리뷰 목록:', reviews.value)
      } else {
        console.error('리뷰 API 응답이 성공하지 못했습니다:', response.data)
      }
    } catch (error) {
      console.error('리뷰 목록을 가져오는 데 실패했습니다:', error)
    } finally {
      isLoading.value = false
    }
  }

  // ISBN으로 도서 정보 검색
  const searchBookByISBN = async (isbn) => {
    if (!isbn || isbn.length < 10) {
      throw new Error('유효한 ISBN을 입력하세요.')
    }

    try {
      const response = await api.post('/api/books/search', { book_isbn: isbn })
      if (response.data.is_success && response.data.data && response.data.data.items && response.data.data.items.length > 0) {
        const book = response.data.data.items[0]
        return {
          success: true,
          data: {
            title: book.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
            author: book.author,
            isbn: book.isbn,
            image: book.image,
            publisher: book.publisher,
            pubdate: book.pubdate,
            description: book.description
          }
        }
      } else {
        return {
          success: false,
          error: '해당 ISBN으로 도서를 찾을 수 없습니다.'
        }
      }
    } catch (error) {
      console.error('도서 검색 실패:', error)
      return {
        success: false,
        error: error.response?.data?.message || '도서 검색에 실패했습니다.'
      }
    }
  }

  return {
    books: computed(() => books.value),
    reviews: computed(() => reviews.value),
    isLoading: computed(() => isLoading.value),
    fetchBooks,
    fetchReviews,
    addBook,
    deleteBook,
    searchBookByISBN,
  }
}