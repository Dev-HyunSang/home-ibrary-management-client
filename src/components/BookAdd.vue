<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">도서 추가</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 바코드 스캔 섹션 -->
        <div>
          <label for="isbn" class="block text-sm font-medium text-gray-700 mb-1">
            ISBN (바코드)
          </label>
          <input
            id="isbn"
            v-model="form.book_isbn"
            type="text"
            placeholder="바코드를 스캔하거나 직접 입력하세요"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            pattern="[0-9]*"
            inputmode="numeric"
            @input="onlyNumbers"
            required
          />

          <!-- 버튼 그룹 -->
          <div class="flex flex-col gap-2 mt-3">
            <!-- 바코드 스캔 버튼 -->
            <button
              type="button"
              @click="startBarcodeScanning"
              :disabled="isScanning"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              {{ isScanning ? '스캔 중...' : '바코드 스캔' }}
            </button>

            <!-- 도서 검색 버튼 -->
            <button
              type="button"
              @click="searchBookInfo"
              :disabled="!form.book_isbn || isSearching"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {{ isSearching ? '검색 중...' : '도서 검색' }}
            </button>
          </div>
        </div>

        <!-- 바코드 스캐너 영역 -->
        <div v-if="isScanning" class="border rounded-lg p-3 sm:p-4 bg-gray-50">
          <div class="text-center">
            <!-- vue-barcode-reader 컴포넌트 -->
            <div class="relative" v-if="useVueBarcodeReader">
              <StreamBarcodeReader
                @decode="onDecode"
                @loaded="onLoaded"
                class="w-full max-w-sm mx-auto rounded-lg overflow-hidden"
              />

              <!-- 스캔 가이드라인 -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="border-2 border-red-500 border-dashed rounded w-3/4 h-16 opacity-75"></div>
              </div>
            </div>

            <!-- 기존 QuaggaJS 스캐너 (백업용) -->
            <div class="relative" v-else>
              <video
                ref="videoElement"
                class="w-full max-w-sm mx-auto rounded-lg bg-black"
                autoplay
                playsinline
                muted
                style="aspect-ratio: 16/9;"
              ></video>

              <!-- 스캔 가이드라인 -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="border-2 border-red-500 border-dashed rounded w-3/4 h-16 opacity-75"></div>
              </div>
            </div>

            <p class="mt-3 text-sm text-gray-600 px-2">
              바코드를 빨간 선 안에 맞춰주세요
            </p>

            <div class="flex flex-col sm:flex-row gap-2 mt-3 justify-center">
              <button
                type="button"
                @click="stopBarcodeScanning"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                스캔 중지
              </button>

              <!-- 스캐너 모드 전환 -->
              <button
                type="button"
                @click="toggleScannerMode"
                class="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs"
              >
                {{ useVueBarcodeReader ? 'QuaggaJS' : 'VueReader' }}
              </button>

              <!-- 수동 입력 안내 -->
              <div class="text-xs text-gray-500 mt-2 sm:mt-0 sm:ml-4 sm:self-center">
                스캔이 어려우면 직접 입력하세요
              </div>
            </div>
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
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
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
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
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
import { StreamBarcodeReader } from 'vue-barcode-reader'

export default {
  name: 'BookAdd',
  components: {
    StreamBarcodeReader
  },
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
    const useVueBarcodeReader = ref(true) // 기본적으로 vue-barcode-reader 사용
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

    const onlyNumbers = (event) => {
      // 숫자만 허용 (0-9)
      const value = event.target.value.replace(/[^0-9]/g, '')
      form.book_isbn = value
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
        message.value = '카메라를 준비하고 있습니다...'
        messageType.value = 'success'

        // 환경 감지
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        // vue-barcode-reader를 사용하는 경우, 컴포넌트가 자동으로 카메라를 처리하므로 바로 리턴
        if (useVueBarcodeReader.value) {
          message.value = '바코드를 빨간 가이드라인 안에 맞춰주세요'
          messageType.value = 'success'
          return
        }

        // getUserMedia 지원 확인
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          message.value = '이 브라우저는 카메라 기능을 지원하지 않습니다.'
          messageType.value = 'error'
          isScanning.value = false
          return
        }

        // 단계별 제약조건으로 시도
        const constraintOptions = [
          // 1차: 이상적인 설정
          {
            video: {
              facingMode: isMobile ? { ideal: 'environment' } : 'user',
              width: { ideal: isMobile ? 1280 : 640 },
              height: { ideal: isMobile ? 720 : 480 },
              aspectRatio: { ideal: 16/9 }
            }
          },
          // 2차: 기본 후면 카메라
          {
            video: {
              facingMode: 'environment'
            }
          },
          // 3차: 기본 전면 카메라
          {
            video: {
              facingMode: 'user'
            }
          },
          // 4차: 최소한의 제약조건
          {
            video: true
          }
        ]

        let stream = null
        let lastError = null

        // 제약조건을 하나씩 시도
        for (const constraints of constraintOptions) {
          try {
            console.log('카메라 접근 시도:', constraints)
            stream = await navigator.mediaDevices.getUserMedia(constraints)
            console.log('카메라 접근 성공!')
            break
          } catch (error) {
            console.warn('카메라 접근 실패, 다음 제약조건 시도:', error)
            lastError = error
            continue
          }
        }

        if (!stream) {
          throw lastError || new Error('모든 카메라 설정에서 접근 실패')
        }

        // 전역 변수에 저장
        window.currentStream = stream

        if (videoElement.value) {
          videoElement.value.srcObject = stream

          // 비디오 로드 대기
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('비디오 로드 타임아웃'))
            }, 10000) // 10초 타임아웃

            videoElement.value.onloadedmetadata = () => {
              clearTimeout(timeout)
              console.log('비디오 메타데이터 로드 완료')
              resolve()
            }

            videoElement.value.onerror = (err) => {
              clearTimeout(timeout)
              reject(err)
            }
          })

          // 비디오 재생 시작
          try {
            await videoElement.value.play()
            console.log('비디오 재생 시작')
          } catch (playError) {
            console.warn('비디오 재생 실패:', playError)
            // 재생 실패해도 계속 진행 (일부 브라우저에서 정상)
          }
        }

        // QuaggaJS를 사용한 바코드 스캔 (동적 import로 처리)
        try {
          const Quagga = await import('quagga')

          // 비디오 안정화를 위한 대기
          await new Promise(resolve => setTimeout(resolve, isMobile ? 2000 : 1000))

          if (!videoElement.value || !isScanning.value) {
            console.log('스캔이 취소되었거나 비디오가 없음')
            return
          }

          console.log('QuaggaJS 초기화 시작...')

          const quaggaConfig = {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: videoElement.value,
              constraints: {
                width: { min: 480, ideal: isMobile ? 1280 : 640, max: 1920 },
                height: { min: 320, ideal: isMobile ? 720 : 480, max: 1080 },
                aspectRatio: { min: 1, max: 2 }
              }
            },
            locator: {
              patchSize: isMobile ? "large" : "medium",
              halfSample: false // PC에서도 false로 설정하여 안정성 향상
            },
            numOfWorkers: navigator.hardwareConcurrency ? Math.min(navigator.hardwareConcurrency, isMobile ? 2 : 4) : 2,
            decoder: {
              readers: [
                "ean_reader",
                "ean_8_reader",
                "code_128_reader"
              ],
              debug: {
                drawBoundingBox: true, // PC에서는 활성화하여 디버깅 도움
                showFrequency: false,
                drawScanline: true,
                showPattern: false
              }
            },
            locate: true,
            frequency: 10 // 스캔 빈도 조절
          }

          Quagga.init(quaggaConfig, (err) => {
            if (err) {
              console.error('바코드 스캐너 초기화 실패:', err)
              message.value = `바코드 스캐너 초기화 실패: ${err.message || err}`
              messageType.value = 'error'
              stopBarcodeScanning()
              return
            }

            console.log('바코드 스캐너 초기화 성공')

            try {
              Quagga.start()
              message.value = '바코드를 빨간 가이드라인 안에 맞춰주세요'
              messageType.value = 'success'
              scanner = Quagga
            } catch (startError) {
              console.error('바코드 스캐너 시작 실패:', startError)
              message.value = '바코드 스캐너 시작에 실패했습니다.'
              messageType.value = 'error'
              stopBarcodeScanning()
            }
          })

          // 바코드 감지 이벤트
          Quagga.onDetected((data) => {
            const code = data.codeResult.code

            // 바코드 유효성 간단 체크 (숫자만, 10-13자리)
            if (/^\d{10,13}$/.test(code)) {
              form.book_isbn = code
              stopBarcodeScanning()
              message.value = `바코드 스캔 완료: ${code}`
              messageType.value = 'success'
            } else {
              console.warn('유효하지 않은 바코드:', code)
            }
          })
        } catch (quaggaError) {
          console.warn('QuaggaJS 로드 실패:', quaggaError)
          message.value = 'QR/바코드 스캐너를 로드할 수 없습니다. 수동으로 입력해주세요.'
          messageType.value = 'error'
          stopBarcodeScanning()
        }

      } catch (error) {
        console.error('카메라 접근 실패:', error)
        let errorMessage = '카메라에 접근할 수 없습니다.'

        if (error.name === 'NotAllowedError') {
          errorMessage = '카메라 권한이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요.'
        } else if (error.name === 'NotFoundError') {
          errorMessage = '카메라를 찾을 수 없습니다.'
        } else if (error.name === 'NotReadableError') {
          errorMessage = '카메라를 사용할 수 없습니다. 다른 앱에서 사용 중일 수 있습니다.'
        }

        message.value = errorMessage
        messageType.value = 'error'
        isScanning.value = false
      }
    }

    const stopBarcodeScanning = () => {
      isScanning.value = false

      try {
        // QuaggaJS 스캐너 정지
        if (scanner) {
          scanner.stop()
          scanner = null
        }

        // 스트림 정지
        const streamToStop = window.currentStream || stream
        if (streamToStop) {
          streamToStop.getTracks().forEach(track => {
            console.log('스트림 트랙 정지:', track.kind, track.label)
            track.stop()
          })
          window.currentStream = null
          stream = null
        }

        // 비디오 엘리먼트 정리
        if (videoElement.value) {
          videoElement.value.srcObject = null
          videoElement.value.load() // 비디오 엘리먼트 리셋
        }

        console.log('바코드 스캔 정지 완료')
      } catch (error) {
        console.error('스캔 정지 중 오류:', error)
      }
    }

    // vue-barcode-reader 이벤트 핸들러
    const onDecode = (text) => {
      console.log('vue-barcode-reader 스캔 성공:', text)

      // 바코드 유효성 검증 (10-13자리 숫자)
      if (/^\d{10,13}$/.test(text)) {
        form.book_isbn = text
        stopBarcodeScanning()
        message.value = `바코드 스캔 완료: ${text}`
        messageType.value = 'success'
      } else {
        console.warn('유효하지 않은 바코드:', text)
        message.value = '올바르지 않은 바코드 형식입니다. 다시 시도해주세요.'
        messageType.value = 'error'
      }
    }

    const onLoaded = () => {
      console.log('vue-barcode-reader 로드 완료')
      message.value = '바코드를 빨간 가이드라인 안에 맞춰주세요'
      messageType.value = 'success'
    }

    // 스캐너 모드 전환
    const toggleScannerMode = () => {
      useVueBarcodeReader.value = !useVueBarcodeReader.value
      console.log('스캐너 모드 변경:', useVueBarcodeReader.value ? 'vue-barcode-reader' : 'QuaggaJS')

      // 현재 스캔을 중지하고 다시 시작
      if (isScanning.value) {
        stopBarcodeScanning()
        // 잠시 후 다시 시작
        setTimeout(() => {
          startBarcodeScanning()
        }, 500)
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
      useVueBarcodeReader,
      resetForm,
      onlyNumbers,
      handleSubmit,
      startBarcodeScanning,
      stopBarcodeScanning,
      onDecode,
      onLoaded,
      toggleScannerMode,
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