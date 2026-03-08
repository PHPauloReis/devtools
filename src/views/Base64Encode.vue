<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Codificar Base64</h1>
      <p class="text-gray-400 mb-8">Converta texto ou arquivo para Base64</p>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 border-b border-dark-700">
        <button
          @click="activeTab = 'text'"
          :class="{
            'text-blue-400 border-b-2 border-blue-400': activeTab === 'text',
            'text-gray-400 hover:text-white': activeTab !== 'text',
          }"
          class="px-4 py-2 transition-colors"
        >
          📝 Texto
        </button>
        <button
          @click="activeTab = 'file'"
          :class="{
            'text-blue-400 border-b-2 border-blue-400': activeTab === 'file',
            'text-gray-400 hover:text-white': activeTab !== 'file',
          }"
          class="px-4 py-2 transition-colors"
        >
          📁 Arquivo
        </button>
      </div>

      <!-- Text Tab -->
      <div v-show="activeTab === 'text'" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Digite o texto aqui:
        </label>
        <textarea
          v-model="inputText"
          placeholder="Digite seu texto aqui..."
          class="w-full h-40 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        ></textarea>
        <div class="text-right text-xs text-gray-400 mt-2">
          {{ inputText.length }} caracteres
        </div>
      </div>

      <!-- File Tab -->
      <div v-show="activeTab === 'file'" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Selecione um arquivo:
        </label>
        <div
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-dark-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <input
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            class="hidden"
          />
          <p class="text-gray-400 mb-2">Arraste um arquivo aqui ou clique para selecionar</p>
          <button
            @click="$refs.fileInput.click()"
            class="btn-primary text-sm"
          >
            📂 Selecionar Arquivo
          </button>
          <div v-if="fileName" class="mt-4 text-blue-400">
            ✅ Arquivo selecionado: <strong>{{ fileName }}</strong>
          </div>
        </div>
      </div>

      <!-- Output Section -->
      <div v-if="encodedResult" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Resultado Base64:
        </label>
        <div class="bg-dark-900 border-2 border-blue-600/30 rounded-lg p-6">
          <div class="bg-dark-800 rounded p-4 font-mono text-sm text-blue-400 break-words min-h-20 max-h-64 overflow-y-auto whitespace-pre-wrap">
            {{ encodedResult }}
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Tamanho Original</p>
            <p class="text-white font-semibold text-sm">{{ originalSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Tamanho Codificado</p>
            <p class="text-blue-400 font-semibold text-sm">{{ encodedSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Aumento</p>
            <p class="text-yellow-400 font-semibold text-sm">{{ sizeIncrease }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
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
            @click="copyAsDataUrl"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            🔗 Data URL
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
        <p class="text-gray-400 text-lg">📝 Digite ou selecione um arquivo para codificar</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClipboard, useNotification } from '@/composables'

const inputText = ref('')
const fileName = ref('')
const fileContent = ref('')
const activeTab = ref('text')
const { copy } = useClipboard()
const { notify } = useNotification()

const fileInput = ref(null)

// Função para converter UTF-8 para Base64
const utf8ToBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
}

const encodedResult = computed(() => {
  if (activeTab.value === 'text') {
    const text = inputText.value
    if (!text) return ''
    
    try {
      return utf8ToBase64(text)
    } catch (error) {
      notify.error('Erro ao codificar: ' + error.message)
      return ''
    }
  } else {
    // Para arquivo, fileContent já é Base64 puro extraído do Data URL
    return fileContent.value
  }
})

const originalSize = computed(() => {
  const text = activeTab.value === 'text' ? inputText.value : fileContent.value
  const bytes = new TextEncoder().encode(text).length
  return formatBytes(bytes)
})

const encodedSize = computed(() => {
  const bytes = new TextEncoder().encode(encodedResult.value).length
  return formatBytes(bytes)
})

const sizeIncrease = computed(() => {
  const originalBytes = new TextEncoder().encode(
    activeTab.value === 'text' ? inputText.value : fileContent.value
  ).length
  const encodedBytes = new TextEncoder().encode(encodedResult.value).length

  if (originalBytes === 0) return '0%'

  const increase = ((encodedBytes - originalBytes) / originalBytes) * 100
  return increase.toFixed(1) + '%'
})

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (file) {
    fileName.value = file.name
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        // e.target.result já é um Data URL com Base64 incorporado
        // Formato: data:mime/type;base64,xxxxx
        // Extrair apenas a parte Base64 (após a vírgula)
        const dataUrl = e.target.result
        fileContent.value = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
        activeTab.value = 'file'
        notify.success('Arquivo carregado com sucesso!')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      notify.error('Erro ao ler arquivo')
    }
  }
}

const handleDrop = async (event) => {
  event.preventDefault()
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    fileName.value = file.name
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        // e.target.result já é um Data URL com Base64 incorporado
        const dataUrl = e.target.result
        fileContent.value = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
        activeTab.value = 'file'
        notify.success('Arquivo carregado com sucesso!')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      notify.error('Erro ao ler arquivo')
    }
  }
}

const copyResult = async () => {
  await copy(encodedResult.value)
}

const copyAsDataUrl = async () => {
  const mimeType = 'text/plain'
  const dataUrl = `data:${mimeType};base64,${encodedResult.value}`
  await copy(dataUrl)
  notify.success('Data URL copiada!')
}

const downloadResult = () => {
  const text = activeTab.value === 'text' ? 'codificado.txt' : `${fileName.value}.b64`
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(encodedResult.value)}`
  )
  element.setAttribute('download', text)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('Download iniciado!')
}

const clearAll = () => {
  inputText.value = ''
  fileContent.value = ''
  fileName.value = ''
  if (fileInput.value) fileInput.value.value = ''
  activeTab.value = 'text'
  notify.success('Tudo limpo!')
}

</script>

<style scoped></style>
