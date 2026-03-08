<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Maiúscula / Minúscula</h1>
      <p class="text-gray-400 mb-8">Converta texto entre diferentes tipos de capitalização</p>

      <!-- Input Area -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Digite ou cole o texto aqui:
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

      <!-- Select Case Type -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Selecione o tipo de conversão:
        </label>
        <select
          v-model="selectedCase"
          class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="uppercase">TUDO MAIÚSCULA</option>
          <option value="lowercase">tudo minúscula</option>
          <option value="capitalize">Primeira Letra Maiúscula</option>
          <option value="sentence">Primeira De Cada Sentença</option>
          <option value="toggle">Inverter Maiúscula/Minúscula</option>
          <option value="titlecase">Title Case - Primeira De Cada Palavra</option>
        </select>
      </div>

      <!-- Output Section -->
      <div v-if="inputText.trim()" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Resultado ({{ caseNames[selectedCase] }}):
        </label>
        <div class="bg-dark-900 border-2 border-blue-600/30 rounded-lg p-6">
          <div class="bg-dark-800 rounded p-4 font-mono text-lg text-blue-400 break-words min-h-20 flex items-center whitespace-pre-wrap">
            {{ convertedText }}
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Texto Original</p>
            <p class="text-white font-semibold text-sm">{{ inputText.length }} caracteres</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Resultado</p>
            <p class="text-blue-400 font-semibold text-sm">{{ convertedText.length }} caracteres</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Mudanças</p>
            <p class="text-green-400 font-semibold text-sm">{{ changesCount }}%</p>
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
import { useClipboard, useNotification } from '@/composables'

const inputText = ref('')
const selectedCase = ref('uppercase')
const { copy } = useClipboard()
const { notify } = useNotification()

const caseNames = {
  uppercase: 'TUDO MAIÚSCULA',
  lowercase: 'tudo minúscula',
  capitalize: 'Primeira Letra Maiúscula',
  sentence: 'Primeira De Cada Sentença',
  toggle: 'Inverter Maiúscula/Minúscula',
  titlecase: 'Title Case - Primeira De Cada Palavra',
}

const convertedText = computed(() => {
  const text = inputText.value

  if (!text) return ''

  switch (selectedCase.value) {
    case 'uppercase':
      return text.toUpperCase()

    case 'lowercase':
      return text.toLowerCase()

    case 'capitalize':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

    case 'sentence':
      return text
        .split(/([.!?]\s+)/)
        .map((part, index) => {
          if (index % 2 === 0 && part.trim()) {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          }
          return part
        })
        .join('')

    case 'toggle':
      return text
        .split('')
        .map(char => {
          if (char === char.toUpperCase()) return char.toLowerCase()
          return char.toUpperCase()
        })
        .join('')

    case 'titlecase':
      return text
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

    default:
      return text
  }
})

const changesCount = computed(() => {
  if (inputText.value.length === 0) return 0

  let changes = 0
  for (let i = 0; i < inputText.value.length; i++) {
    if (inputText.value[i] !== convertedText.value[i]) {
      changes++
    }
  }

  return Math.round((changes / inputText.value.length) * 100)
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
    stats: {
      characteresOriginal: inputText.value.length,
      caracteresResultado: convertedText.value.length,
      percentualMudanca: changesCount.value,
    },
  }

  const json = JSON.stringify(data, null, 2)
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:application/json;charset=utf-8,${encodeURIComponent(json)}`
  )
  element.setAttribute('download', `text-case-${Date.now()}.json`)
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

const loadExample1 = () => {
  inputText.value = 'Olá, mundo! este é um exemplo de texto simples.'
  notify.success('Exemplo 1 carregado!')
}

const loadExample2 = () => {
  inputText.value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`
  notify.success('Exemplo 2 carregado!')
}

const loadExample3 = () => {
  inputText.value = `Esta é a primeira sentença. esta é a segunda. e esta é a terceira! 
você pode converter cada sentença separadamente.`
  notify.success('Exemplo 3 carregado!')
}
</script>

<style scoped></style>
