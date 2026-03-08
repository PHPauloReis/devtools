<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Decodificar Base64</h1>
      <p class="text-gray-400 mb-8">Converta Base64 de volta para texto ou arquivo</p>

      <!-- Input Area -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Cole o Base64 aqui:
        </label>
        <textarea
          v-model="inputBase64"
          placeholder="Cole seu Base64 aqui..."
          class="w-full h-40 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
        ></textarea>
        <div class="text-right text-xs text-gray-400 mt-2">
          {{ inputBase64.length }} caracteres
        </div>
      </div>

      <!-- Validation Error -->
      <div v-if="isInvalidBase64" class="bg-red-600/10 border border-red-600/20 rounded-lg p-4 mb-8">
        <p class="text-sm text-red-400">
          ❌ Base64 inválido! Verifique se o formato está correto.
        </p>
      </div>

      <!-- Output Section -->
      <div v-if="!isInvalidBase64 && inputBase64.trim()" class="mb-8">
        <!-- Preview de Imagem -->
        <div v-if="isImage" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Preview da Imagem:
          </label>
          <div class="bg-dark-900 border border-dark-700 rounded-lg p-6 flex items-center justify-center">
            <img
              :src="imagePreviewUrl"
              :alt="'Preview'"
              class="max-w-full max-h-96 rounded"
            />
          </div>
        </div>

        <!-- Preview PDF -->
        <div v-if="isPdf" class="mb-8">
            <label class="block text-sm font-semibold text-gray-300 mb-3">
                Preview do PDF:
            </label>

            <div class="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden">
                <iframe
                :src="pdfPreviewUrl"
                class="w-full h-[600px]"
                ></iframe>
            </div>
        </div>

        <!-- Resultado em Texto -->
        <div v-if="isPlainText" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Resultado Decodificado:
          </label>
          <div class="bg-dark-900 border-2 border-green-600/30 rounded-lg p-6">
            <div class="bg-dark-800 rounded p-4 text-green-400 break-words min-h-20 max-h-64 overflow-y-auto whitespace-pre-wrap">
              {{ decodedResult }}
            </div>
          </div>
        </div>

        <!-- Arquivo não-imagem -->
        <div v-if="isFile" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Arquivo Decodificado:
          </label>
          <div class="bg-dark-900 border-2 border-purple-600/30 rounded-lg p-6">
            <div class="text-center">
              <p class="text-gray-400 mb-4">📦 Arquivo binário detectado</p>
              <button
                @click="downloadFileContent"
                class="btn-primary flex items-center justify-center gap-2"
              >
                💾 Download do Arquivo
              </button>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Tamanho Base64</p>
            <p class="text-white font-semibold text-sm">{{ base64Size }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Tamanho Decodificado</p>
            <p class="text-green-400 font-semibold text-sm">{{ decodedSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Redução</p>
            <p class="text-yellow-400 font-semibold text-sm">{{ sizeReduction }}</p>
          </div>
        </div>

        <!-- Tipo Detectado -->
        <div v-if="detectedMimeType" class="bg-dark-900 rounded-lg p-3 border border-dark-700 mb-8">
          <p class="text-gray-400 text-xs mb-1">Tipo de Arquivo Detectado</p>
          <p class="text-blue-400 font-semibold text-sm">{{ detectedMimeType }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            @click="copyResult"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            📋 Copiar
          </button>
          <button
            @click="downloadResult"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            💾 Download
          </button>
          <button
            v-if="isImage"
            @click="downloadAsImage"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            🖼️ Salvar Imagem
          </button>
          <button
            @click="clearAll"
            class="btn-secondary flex items-center justify-center gap-2 text-sm"
          >
            🗑️ Limpar
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-dark-900 rounded-lg border border-dark-700">
        <p class="text-gray-400 text-lg">📝 Cole Base64 para decodificar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClipboard, useNotification } from '@/composables'

const inputBase64 = ref('')
const { copy } = useClipboard()
const { notify } = useNotification()

// Função para validar Base64
const isValidBase64 = (str) => {
  if (!str) return false

  if (str.includes(',')) {
    str = str.split(',')[1]
  }

  str = str.trim()

  try {
    atob(str)
    return true
  } catch {
    return false
  }
}

// Função para extrair dados de Data URL
const extractDataUrl = (str) => {
  str = str.trim()

  if (str.startsWith('data:')) {
    const [header, data] = str.split(',')

    const mimeMatch = header.match(/data:(.*?);base64/)
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream'

    return { data, mimeType }
  }

  return {
    data: str,
    mimeType: 'application/octet-stream'
  }
}

// Função para decodificar Base64
const base64ToString = (str) => {
  try {
    const { data } = extractDataUrl(str)

    const decoded = atob(data)

    const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0))

    return new TextDecoder().decode(bytes)

  } catch {
    return ''
  }
}

const mimeType = computed(() => {
  if (!inputBase64.value) return ''

  const { mimeType } = extractDataUrl(inputBase64.value)
  return mimeType
})

const isInvalidBase64 = computed(() => {
  return inputBase64.value.trim().length > 0 && !isValidBase64(inputBase64.value)
})

const decodedResult = computed(() => {
  if (!isPlainText.value) return ''
  if (!inputBase64.value.trim()) return ''

  return base64ToString(inputBase64.value)
})

const detectedMimeType = computed(() => {
  if (!inputBase64.value.includes('data:')) return ''
  const { mimeType } = extractDataUrl(inputBase64.value)
  return mimeType !== 'text/plain' ? mimeType : ''
})

const isImage = computed(() => {
  if (!inputBase64.value) return false

  const base64 = inputBase64.value.trim()

  if (base64.startsWith('data:image/')) return true

  // PNG
  if (base64.startsWith('iVBORw0KGgo')) return true

  // JPEG
  if (base64.startsWith('/9j/')) return true

  // GIF
  if (base64.startsWith('R0lGOD')) return true

  // WEBP
  if (base64.startsWith('UklGR')) return true

  return false
})

const isPdf = computed(() => {
  if (!inputBase64.value) return false

  const base64 = inputBase64.value.trim()

  // assinatura de PDF
  if (base64.startsWith('JVBER')) return true

  // caso venha como dataURL
  if (base64.startsWith('data:application/pdf')) return true

  return false
})

const isFile = computed(() => {
  return !isImage.value && !isPlainText.value && mimeType.value !== ''
})

const isPlainText = computed(() => {
  if (isImage.value) return false
  if (isPdf.value) return false

  if (!inputBase64.value.startsWith('data:')) return true

  return mimeType.value.startsWith('text/')
})

const imagePreviewUrl = computed(() => {
  if (!isImage.value) return ''

  let base64 = inputBase64.value.trim()

  if (base64.startsWith('data:image')) {
    return base64
  }

  // Detecta tipo
  let mime = 'image/jpeg'

  if (base64.startsWith('iVBOR')) mime = 'image/png'
  if (base64.startsWith('R0lGOD')) mime = 'image/gif'
  if (base64.startsWith('UklGR')) mime = 'image/webp'

  return `data:${mime};base64,${base64}`
})

const pdfPreviewUrl = computed(() => {
  if (!isPdf.value) return ''

  let base64 = inputBase64.value.trim()

  if (base64.startsWith('data:application/pdf')) {
    return base64
  }

  return `data:application/pdf;base64,${base64}`
})

const base64Size = computed(() => {
  const bytes = new TextEncoder().encode(inputBase64.value).length
  return formatBytes(bytes)
})

const decodedSize = computed(() => {
  const bytes = new TextEncoder().encode(decodedResult.value).length
  return formatBytes(bytes)
})

const sizeReduction = computed(() => {
  const base64Bytes = new TextEncoder().encode(inputBase64.value).length
  const decodedBytes = new TextEncoder().encode(decodedResult.value).length

  if (base64Bytes === 0) return '0%'

  const reduction = ((base64Bytes - decodedBytes) / base64Bytes) * 100
  return reduction.toFixed(1) + '%'
})

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const copyResult = async () => {
  await copy(decodedResult.value)
  notify.success('Copiado!')
}

const downloadResult = () => {
  const ext = isImage.value ? 'jpg' : 'txt'
  const filename = `decodificado.${ext}`
  
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(decodedResult.value)}`
  )
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('Download iniciado!')
}

const downloadAsImage = () => {
  if (!isImage.value) return
  
  const element = document.createElement('a')
  element.setAttribute('href', imagePreviewUrl.value)
  element.setAttribute('download', 'imagem')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('Imagem salva!')
}

const downloadFileContent = () => {
  if (!isFile.value) return
  
  try {
    // Extrai o Base64 puro
    let base64 = inputBase64.value.trim()
    if (base64.includes(',')) {
      base64 = base64.split(',')[1]
    }
    
    // Converte Base64 para Blob
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: detectedMimeType.value })
    
    // Gera URL e faz download
    const blobUrl = URL.createObjectURL(blob)
    const element = document.createElement('a')
    element.setAttribute('href', blobUrl)
    
    // Tenta extrair extensão do MIME type
    const extension = detectedMimeType.value.split('/')[1] || 'bin'
    element.setAttribute('download', `arquivo.${extension}`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    URL.revokeObjectURL(blobUrl)
    
    notify.success('Arquivo salvo!')
  } catch (error) {
    notify.error('Erro ao baixar arquivo')
  }
}

const clearAll = () => {
  inputBase64.value = ''
  notify.success('Limpo!')
}

const loadExample1 = () => {
  inputBase64.value = 'T2zDoSwgbXVuZG8h'
  notify.success('Exemplo 1 carregado!')
}

const loadExample2 = () => {
  inputBase64.value = 'dXN1YXJpb0BleGFtcGxlLmNvbTpzZW5oYTEyMw=='
  notify.success('Exemplo 2 carregado!')
}

const loadExample3 = () => {
  inputBase64.value = 'aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vcGF0aD9wYXJhbT12YWx1ZQ=='
  notify.success('Exemplo 3 carregado!')
}
</script>

<style scoped></style>
