<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Conversor de Case</h1>
      <p class="text-gray-400 mb-8">Converta texto entre diferentes tipos de formatação</p>

      <!-- Input Area -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Digite o texto a ser convertido:
        </label>
        <textarea
          v-model="inputText"
          placeholder="Digite seu texto aqui..."
          class="w-full h-40 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <!-- Select Case Type -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Selecione o tipo de formatação:
        </label>
        <select
          v-model="selectedCase"
          class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="camelCase">camelCase - helloWorld</option>
          <option value="snakeCase">snake_case - hello_world</option>
          <option value="kebabCase">kebab-case - hello-world</option>
          <option value="pascalCase">PascalCase - HelloWorld</option>
          <option value="upperSnakeCase">UPPER_SNAKE_CASE - HELLO_WORLD</option>
          <option value="titleCase">Title Case - Hello World</option>
          <option value="slug">Slug - hello-world (URL-friendly)</option>
          <option value="uppercase">UPPERCASE - HELLO WORLD</option>
          <option value="lowercase">lowercase - hello world</option>
          <option value="reversed">Invertido - dlrow olleH</option>
        </select>
      </div>

      <!-- Output Section -->
      <div v-if="inputText.trim()" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Resultado ({{ caseNames[selectedCase] }}):
        </label>
        <div class="bg-dark-900 border-2 border-blue-600/30 rounded-lg p-6">
          <div class="bg-dark-800 rounded p-4 font-mono text-lg text-blue-400 break-all min-h-20 flex items-center">
            {{ convertedText }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <button
            @click="copyResult"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            📋 Copiar Resultado
          </button>
          <button
            @click="copyText"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            📄 Copiar Original
          </button>
          <button
            @click="downloadResult"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            💾 Download JSON
          </button>
          <button
            @click="clearText"
            class="btn-secondary flex items-center justify-center gap-2 text-sm"
          >
            🗑️ Limpar
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-dark-900 rounded-lg border border-dark-700">
        <p class="text-gray-400 text-lg">📝 Digite algo para ver o resultado</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toPascalCase,
  toUpperSnakeCase,
  toTitleCase,
  toSlug,
} from '@/utils/helpers'
import { useClipboard, useNotification } from '@/composables'

const inputText = ref('')
const selectedCase = ref('uppercase')
const { copy } = useClipboard()
const { notify } = useNotification()

const caseNames = {
  camelCase: 'camelCase',
  snakeCase: 'snake_case',
  kebabCase: 'kebab-case',
  pascalCase: 'PascalCase',
  upperSnakeCase: 'UPPER_SNAKE_CASE',
  titleCase: 'Title Case',
  slug: 'Slug',
  uppercase: 'UPPERCASE',
  lowercase: 'lowercase',
  reversed: 'Invertido',
}

const convertedText = computed(() => {
  const text = inputText.value.trim()

  if (!text) return ''

  switch (selectedCase.value) {
    case 'camelCase':
      return toCamelCase(text)
    case 'snakeCase':
      return toSnakeCase(text)
    case 'kebabCase':
      return toKebabCase(text)
    case 'pascalCase':
      return toPascalCase(text)
    case 'upperSnakeCase':
      return toUpperSnakeCase(text)
    case 'titleCase':
      return toTitleCase(text)
    case 'slug':
      return toSlug(text)
    case 'uppercase':
      return text.toUpperCase()
    case 'lowercase':
      return text.toLowerCase()
    case 'reversed':
      return text.split('').reverse().join('')
    default:
      return ''
  }
})

const copyResult = async () => {
  await copy(convertedText.value)
}

const copyText = async () => {
  await copy(inputText.value)
}

const downloadResult = async () => {
  const data = {
    entrada: inputText.value,
    tipo: selectedCase.value,
    saida: convertedText.value,
    timestamp: new Date().toISOString(),
  }

  const json = JSON.stringify(data, null, 2)
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:application/json;charset=utf-8,${encodeURIComponent(json)}`
  )
  element.setAttribute('download', `case-converter-${Date.now()}.json`)
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

</script>

<style scoped></style>
