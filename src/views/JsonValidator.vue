<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Validador de JSON</h1>
      <p class="text-gray-400 mb-8">Valide e formate JSON com facilidade</p>

      <!-- Input Area -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Cole ou digite seu JSON:
        </label>
        <textarea
          v-model="inputJson"
          placeholder='{"chave": "valor"}'
          class="w-full h-40 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
        ></textarea>
        <div class="text-right text-xs text-gray-400 mt-2">
          {{ inputJson.length }} caracteres
        </div>
      </div>

      <!-- Validation Status -->
      <div v-if="inputJson.trim()" class="mb-8">
        <div v-if="isValidJson" class="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
          <p class="text-sm text-green-400">
            ✅ <strong>JSON válido!</strong>
          </p>
        </div>
        <div v-else class="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
          <p class="text-sm text-red-400">
            ❌ <strong>JSON inválido!</strong>
          </p>
          <p class="text-xs text-red-400 mt-2">{{ jsonError }}</p>
        </div>
      </div>

      <!-- Info Box -->
      <div class="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-8">
        <h3 class="text-sm font-semibold text-blue-400 mb-2">💡 Dica</h3>
        <p class="text-sm text-gray-300">
          JSON válido deve ter chaves entre aspas duplas e estar bem formatado. Objetos usam {}, arrays usam [].
        </p>
      </div>

      <!-- Output Section -->
      <div v-if="isValidJson && inputJson.trim()" class="mb-8">
        <!-- Tabs -->
        <div class="flex gap-2 mb-6 border-b border-dark-700">
          <button
            @click="outputTab = 'formatted'"
            :class="{
              'text-blue-400 border-b-2 border-blue-400': outputTab === 'formatted',
              'text-gray-400 hover:text-white': outputTab !== 'formatted',
            }"
            class="px-4 py-2 transition-colors"
          >
            📋 Formatado
          </button>
          <button
            @click="outputTab = 'minified'"
            :class="{
              'text-blue-400 border-b-2 border-blue-400': outputTab === 'minified',
              'text-gray-400 hover:text-white': outputTab !== 'minified',
            }"
            class="px-4 py-2 transition-colors"
          >
            📦 Minimizado
          </button>
          <button
            @click="outputTab = 'tree'"
            :class="{
              'text-blue-400 border-b-2 border-blue-400': outputTab === 'tree',
              'text-gray-400 hover:text-white': outputTab !== 'tree',
            }"
            class="px-4 py-2 transition-colors"
          >
            🌳 Estrutura
          </button>
        </div>

        <!-- Formatted Output -->
        <div v-show="outputTab === 'formatted'" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            JSON Formatado:
          </label>
          <div class="bg-dark-900 border-2 border-green-600/30 rounded-lg p-6">
            <div class="bg-dark-800 rounded p-4 text-green-400 break-words min-h-20 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
              {{ formattedJson }}
            </div>
          </div>
        </div>

        <!-- Minified Output -->
        <div v-show="outputTab === 'minified'" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            JSON Minimizado:
          </label>
          <div class="bg-dark-900 border-2 border-blue-600/30 rounded-lg p-6">
            <div class="bg-dark-800 rounded p-4 text-blue-400 break-words min-h-20 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
              {{ minifiedJson }}
            </div>
          </div>
        </div>

        <!-- Tree Structure -->
        <div v-show="outputTab === 'tree'" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Estrutura do JSON:
          </label>
          <div class="bg-dark-900 border-2 border-purple-600/30 rounded-lg p-6">
            <div class="bg-dark-800 rounded p-4 text-purple-400 min-h-20 max-h-96 overflow-y-auto font-mono text-xs whitespace-pre-wrap">
              {{ jsonStructure }}
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Original</p>
            <p class="text-white font-semibold text-sm">{{ originalSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Formatado</p>
            <p class="text-green-400 font-semibold text-sm">{{ formattedSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Minimizado</p>
            <p class="text-blue-400 font-semibold text-sm">{{ minifiedSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Economia (Min)</p>
            <p class="text-yellow-400 font-semibold text-sm">{{ savings }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            @click="copyFormatted"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            📋 Copiar Formatado
          </button>
          <button
            @click="copyMinified"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            📦 Copiar Minimizado
          </button>
          <button
            @click="downloadJson"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            💾 Download
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
        <p class="text-gray-400 text-lg">📝 Cole JSON para validar e formatar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClipboard, useNotification } from '@/composables'

const inputJson = ref('')
const outputTab = ref('formatted')
const { copy } = useClipboard()
const { notify } = useNotification()

// Função para validar JSON
const validateJson = (str) => {
  try {
    JSON.parse(str)
    return { valid: true, error: null }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

const isValidJson = computed(() => {
  if (!inputJson.value.trim()) return false
  const result = validateJson(inputJson.value)
  return result.valid
})

const jsonError = computed(() => {
  if (!inputJson.value.trim()) return ''
  const result = validateJson(inputJson.value)
  return result.error || ''
})

const formattedJson = computed(() => {
  if (!isValidJson.value) return ''
  try {
    const parsed = JSON.parse(inputJson.value)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return ''
  }
})

const minifiedJson = computed(() => {
  if (!isValidJson.value) return ''
  try {
    const parsed = JSON.parse(inputJson.value)
    return JSON.stringify(parsed)
  } catch {
    return ''
  }
})

const jsonStructure = computed(() => {
  if (!isValidJson.value) return ''
  try {
    const parsed = JSON.parse(inputJson.value)
    return buildStructure(parsed, 0)
  } catch {
    return ''
  }
})

// Função recursiva para construir a estrutura do JSON
const buildStructure = (obj, depth = 0) => {
  const indent = '  '.repeat(depth)
  const nextIndent = '  '.repeat(depth + 1)

  if (obj === null) return 'null'
  if (typeof obj === 'boolean') return obj ? 'boolean (true)' : 'boolean (false)'
  if (typeof obj === 'number') return `number (${obj})`
  if (typeof obj === 'string') return `string (${obj.length} chars)`
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[] (array vazio)'
    
    let result = `[] (${obj.length} items)\n`
    obj.slice(0, 10).forEach((item, i) => {
      result += `${nextIndent}[${i}] ${buildStructure(item, depth + 1)}\n`
    })
    if (obj.length > 10) {
      result += `${nextIndent}... e mais ${obj.length - 10} items`
    }
    return result
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    if (keys.length === 0) return '{} (objeto vazio)'
    
    let result = `{} (${keys.length} keys)\n`
    keys.slice(0, 10).forEach((key) => {
      result += `${nextIndent}${key}: ${buildStructure(obj[key], depth + 1)}\n`
    })
    if (keys.length > 10) {
      result += `${nextIndent}... e mais ${keys.length - 10} keys`
    }
    return result
  }
  
  return 'unknown'
}

const originalSize = computed(() => {
  return formatBytes(new TextEncoder().encode(inputJson.value).length)
})

const formattedSize = computed(() => {
  return formatBytes(new TextEncoder().encode(formattedJson.value).length)
})

const minifiedSize = computed(() => {
  return formatBytes(new TextEncoder().encode(minifiedJson.value).length)
})

const savings = computed(() => {
  const original = new TextEncoder().encode(inputJson.value).length
  const minified = new TextEncoder().encode(minifiedJson.value).length
  
  if (original === 0) return '0%'
  
  const reduction = ((original - minified) / original) * 100
  return reduction.toFixed(1) + '%'
})

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const copyFormatted = async () => {
  await copy(formattedJson.value)
  notify.success('JSON formatado copiado!')
}

const copyMinified = async () => {
  await copy(minifiedJson.value)
  notify.success('JSON minimizado copiado!')
}

const downloadJson = () => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:application/json;charset=utf-8,${encodeURIComponent(formattedJson.value)}`
  )
  element.setAttribute('download', `dados-${Date.now()}.json`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('Download iniciado!')
}

const clearAll = () => {
  inputJson.value = ''
  outputTab.value = 'formatted'
  notify.success('Limpo!')
}

</script>

<style scoped></style>
