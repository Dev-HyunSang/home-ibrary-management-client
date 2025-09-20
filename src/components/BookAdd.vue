<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">도서 추가</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 바코드 스캔 섹션 -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="isbn" class="block text-sm font-medium text-gray-700 mb-1">
              ISBN (바코드)
            </label>
            <div class="flex gap-2">
              <input
                id="isbn"
                v-model="form.book_isbn"
                type="text"
                placeholder="바코드를 스캔하거나 직접 입력하세요"
                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                @click="startBarcodeScanning"
                :disabled="isScanning"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                {{ isScanning ? '스캔 중...' : '바코드 스캔' }}
              </button>
              <button
                type="button"
                @click="searchBookInfo"
                :disabled="!form.book_isbn || isSearching"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {{ isSearching ? '검색 중...' : '도서 검색' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 바코드 스캐너 영역 -->
        <div v-if="isScanning" class="border rounded-lg p-4 bg-gray-50">
          <div class="text-center">
            <video
              ref="videoElement"
              class="w-full max-w-md mx-auto rounded-lg"
              autoplay
              playsinline
            ></video>
            <p class="mt-2 text-sm text-gray-600">바코드를 카메라에 가까이 대주세요</p>
            <button
              type="button"
              @click="stopBarcodeScanning"
              class="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              스캔 중지
            </button>
          </div>
        </div>

        <!-- 검색 결과 -->
        <div v-if="searchResults.length > 0" class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900">검색 결과</h4>
          <div class="space-y-3">
            <div
              v-for="book in searchResults"
              :key="book.isbn"
              class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              @click="selectBook(book)"
            >
              <div class="flex items-start space-x-4">
                <img
                  v-if="book.image"
                  :src="book.image"
                  :alt="book.title"
                  class="w-16 h-20 object-cover rounded"
                />
                <div class="flex-1 min-w-0">
                  <h5 class="text-sm font-medium text-gray-900 truncate">
                    {{ book.title }}
                  </h5>
                  <p class="text-sm text-gray-600 mt-1">{{ book.author }}</p>
                  <p class="text-xs text-gray-500 mt-1">ISBN: {{ book.isbn }}</p>
                  <p class="text-xs text-gray-500">{{ book.publisher }} · {{ book.pubdate }}</p>
                  <button
                    type="button"
                    class="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    이 도서 선택
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 도서 정보 입력 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
              제목 *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="도서 제목을 입력하세요"
            />
          </div>

          <div>
            <label for="author" class="block text-sm font-medium text-gray-700 mb-1">
              저자 *
            </label>
            <input
              id="author"
              v-model="form.author"
              type="text"
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="저자명을 입력하세요"
            />
          </div>
        </div>

        <!-- 버튼 그룹 -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            초기화
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? '추가 중...' : '도서 추가' }}
          </button>
        </div>
      </form>

      <!-- 결과 메시지 -->
      <div v-if="message" :class="messageClass" class="mt-4 p-4 rounded-md">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useBook } from '@/composables/useBook'

export default {
  name: 'BookAdd',
  setup() {
    const { addBook, searchBookByISBN } = useBook()

    const form = reactive({
      title: '',
      author: '',
      book_isbn: ''
    })

    const isSubmitting = ref(false)
    const isScanning = ref(false)
    const isSearching = ref(false)
    const message = ref('')
    const messageType = ref('')
    const videoElement = ref(null)
    const searchResults = ref([])
    let stream = null
    let scanner = null

    const messageClass = computed(() => {
      return messageType.value === 'success'
        ? 'bg-green-50 border border-green-200 text-green-800'
        : 'bg-red-50 border border-red-200 text-red-800'
    })

    const resetForm = () => {
      form.title = ''
      form.author = ''
      form.book_isbn = ''
      message.value = ''
      searchResults.value = []
    }

    const handleSubmit = async () => {
      isSubmitting.value = true
      message.value = ''

      try {
        const result = await addBook({
          title: form.title,
          author: form.author,
          book_isbn: form.book_isbn
        })

        if (result.success) {
          message.value = '도서가 성공적으로 추가되었습니다!'
          messageType.value = 'success'
          resetForm()
        } else {
          message.value = result.error || '도서 추가에 실패했습니다.'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = '도서 추가 중 오류가 발생했습니다.'
        messageType.value = 'error'
      } finally {
        isSubmitting.value = false
      }
    }

    const startBarcodeScanning = async () => {
      try {
        isScanning.value = true

        // 카메라 접근
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // 후면 카메라 우선
        })

        if (videoElement.value) {
          videoElement.value.srcObject = stream
        }

        // QuaggaJS를 사용한 바코드 스캔 (동적 import로 처리)
        try {
          const Quagga = await import('quagga')

          setTimeout(() => {
            if (videoElement.value && isScanning.value) {
              Quagga.init({
                inputStream: {
                  name: "Live",
                  type: "LiveStream",
                  target: videoElement.value,
                  constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                  }
                },
                decoder: {
                  readers: ["ean_reader", "ean_8_reader", "code_128_reader"]
                }
              }, (err) => {
                if (err) {
                  console.error('바코드 스캐너 초기화 실패:', err)
                  stopBarcodeScanning()
                  return
                }
                Quagga.start()
              })

              Quagga.onDetected((data) => {
                const code = data.codeResult.code
                form.book_isbn = code
                stopBarcodeScanning()
                message.value = `바코드 스캔 완료: ${code}`
                messageType.value = 'success'
              })

              scanner = Quagga
            }
          }, 1000)
        } catch (quaggaError) {
          console.warn('QuaggaJS 로드 실패, 수동 입력만 가능합니다:', quaggaError)
          message.value = 'QR/바코드 스캐너를 로드할 수 없습니다. 수동으로 입력해주세요.'
          messageType.value = 'error'
          stopBarcodeScanning()
        }

      } catch (error) {
        console.error('카메라 접근 실패:', error)
        message.value = '카메라에 접근할 수 없습니다. 수동으로 입력해주세요.'
        messageType.value = 'error'
        isScanning.value = false
      }
    }

    const stopBarcodeScanning = () => {
      isScanning.value = false

      if (scanner) {
        scanner.stop()
        scanner = null
      }

      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        stream = null
      }

      if (videoElement.value) {
        videoElement.value.srcObject = null
      }
    }

    // ISBN으로 도서 정보 검색
    const searchBookInfo = async () => {
      if (!form.book_isbn) {
        message.value = 'ISBN을 입력해주세요.'
        messageType.value = 'error'
        return
      }

      isSearching.value = true
      message.value = ''
      searchResults.value = []

      try {
        const result = await searchBookByISBN(form.book_isbn)

        if (result.success && result.data) {
          searchResults.value = [result.data]
          message.value = '도서 정보를 찾았습니다. 아래에서 선택해주세요.'
          messageType.value = 'success'
        } else {
          message.value = result.error || '도서 정보를 찾을 수 없습니다.'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = '도서 검색 중 오류가 발생했습니다.'
        messageType.value = 'error'
      } finally {
        isSearching.value = false
      }
    }

    // 검색 결과에서 도서 선택
    const selectBook = (book) => {
      form.title = book.title
      form.author = book.author
      form.book_isbn = book.isbn
      searchResults.value = []
      message.value = '도서 정보가 입력되었습니다!'
      messageType.value = 'success'
    }

    onUnmounted(() => {
      stopBarcodeScanning()
    })

    return {
      form,
      isSubmitting,
      isScanning,
      isSearching,
      message,
      messageClass,
      videoElement,
      searchResults,
      resetForm,
      handleSubmit,
      startBarcodeScanning,
      stopBarcodeScanning,
      searchBookInfo,
      selectBook
    }
  }
}
</script>

<style scoped>
video {
  background: #000;
}
</style>