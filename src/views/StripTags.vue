<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Remover Tags HTML/XML</h1>
      <p class="text-gray-400 mb-8">Remova tags HTML, XML e outras marcações de um texto</p>

      <!-- Input Area -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Texto com tags:
        </label>
        <textarea
          v-model="inputText"
          placeholder="Cole seu HTML/XML aqui..."
          class="w-full h-40 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <!-- Options -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Modo:
          </label>
          <select
            v-model="stripMode"
            class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Remover Todas as Tags</option>
            <option value="keep">Manter Tags Específicas</option>
          </select>
        </div>

        <div v-if="stripMode === 'keep'">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Tags a Manter (separadas por vírgula):
          </label>
          <input
            v-model="allowedTags"
            type="text"
            placeholder="p, br, strong, em"
            class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>

      <!-- Presets -->
      <div v-if="stripMode === 'keep'" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Presets:
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            @click="allowedTags = 'p,br'"
            class="btn-secondary text-xs py-2"
          >
            Básico
          </button>
          <button
            @click="allowedTags = 'p,br,strong,em,u,s'"
            class="btn-secondary text-xs py-2"
          >
            Formatação
          </button>
          <button
            @click="allowedTags = 'p,br,strong,em,u,s,h1,h2,h3,h4,h5,h6'"
            class="btn-secondary text-xs py-2"
          >
            Títulos
          </button>
          <button
            @click="allowedTags = 'p,br,strong,em,u,s,a,img,ul,ol,li'"
            class="btn-secondary text-xs py-2"
          >
            Completo
          </button>
        </div>
      </div>

      <!-- Output Section -->
      <div v-if="inputText.trim()" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Resultado:
        </label>
        <div class="bg-dark-900 border-2 border-green-600/30 rounded-lg p-6">
          <div class="bg-dark-800 rounded p-4 text-gray-300 whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
            {{ strippedText }}
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div class="bg-dark-800 rounded-lg p-3 text-center">
            <p class="text-gray-400 text-xs">Caracteres Original</p>
            <p class="text-blue-400 text-lg font-bold">{{ inputText.length }}</p>
          </div>
          <div class="bg-dark-800 rounded-lg p-3 text-center">
            <p class="text-gray-400 text-xs">Caracteres Resultado</p>
            <p class="text-green-400 text-lg font-bold">{{ strippedText.length }}</p>
          </div>
          <div class="bg-dark-800 rounded-lg p-3 text-center">
            <p class="text-gray-400 text-xs">Caracteres Removidos</p>
            <p class="text-red-400 text-lg font-bold">{{ inputText.length - strippedText.length }}</p>
          </div>
          <div class="bg-dark-800 rounded-lg p-3 text-center">
            <p class="text-gray-400 text-xs">Redução</p>
            <p class="text-yellow-400 text-lg font-bold">{{ reductionPercentage }}%</p>
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
            @click="clearText"
            class="btn-secondary flex items-center justify-center gap-2 text-sm"
          >
            🗑️ Limpar
          </button>
          <button
            @click="swapText"
            class="btn-secondary flex items-center justify-center gap-2 text-sm"
          >
            ⇄ Inverter
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-dark-900 rounded-lg border border-dark-700">
        <p class="text-gray-400 text-lg">📝 Cole um texto com tags para começar</p>
      </div>

      <!-- Examples Section -->
      <div class="mt-12 border-t border-dark-700 pt-8">
        <h2 class="text-xl font-bold text-white mb-4">📚 Exemplos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-dark-800 rounded-lg p-4">
            <p class="text-gray-400 text-xs mb-2">Entrada:</p>
            <code class="text-green-400 text-xs font-mono">{{ examples[0].input }}</code>
            <p class="text-gray-400 text-xs mb-2 mt-3">Saída:</p>
            <code class="text-blue-400 text-xs font-mono">{{ examples[0].output }}</code>
          </div>
          <div class="bg-dark-800 rounded-lg p-4">
            <p class="text-gray-400 text-xs mb-2">Entrada:</p>
            <code class="text-green-400 text-xs font-mono">{{ examples[1].input }}</code>
            <p class="text-gray-400 text-xs mb-2 mt-3">Saída:</p>
            <code class="text-blue-400 text-xs font-mono">{{ examples[1].output }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { stripTags } from '@/utils/helpers'
import { useClipboard, useNotification } from '@/composables'

const inputText = ref('')
const stripMode = ref('all')
const allowedTags = ref('')
const { copy } = useClipboard()
const { notify } = useNotification()

const examples = [
  {
    input: '<p>Olá <strong>mundo</strong>!</p>',
    output: 'Olá mundo!',
  },
  {
    input: '<div><h1>Título</h1><p>Conteúdo</p></div>',
    output: 'TítuloConteúdo',
  },
]

const strippedText = computed(() => {
  if (!inputText.value.trim()) return ''
  
  if (stripMode.value === 'all') {
    return stripTags(inputText.value)
  } else {
    return stripTags(inputText.value, allowedTags.value)
  }
})

const reductionPercentage = computed(() => {
  if (inputText.value.length === 0) return 0
  const reduced = ((inputText.value.length - strippedText.value.length) / inputText.value.length) * 100
  return Math.round(reduced)
})

const copyResult = async () => {
  await copy(strippedText.value)
  notify.success('Resultado copiado!')
}

const downloadResult = () => {
  const data = {
    entrada: inputText.value,
    saida: strippedText.value,
    modo: stripMode.value,
    tagsPermitidas: allowedTags.value,
    timestamp: new Date().toISOString(),
  }

  const json = JSON.stringify(data, null, 2)
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:application/json;charset=utf-8,${encodeURIComponent(json)}`
  )
  element.setAttribute('download', `strip-tags-${Date.now()}.json`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('Download iniciado!')
}

const clearText = () => {
  inputText.value = ''
  notify.success('Texto limpo!')
}

const swapText = () => {
  inputText.value = strippedText.value
  notify.success('Textos invertidos!')
}
</script>

<style scoped></style>
