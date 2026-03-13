<template>
  <div class="max-w-5xl mx-auto px-4">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Contador de Caracteres</h1>
      <p class="text-sm md:text-base text-gray-400 mb-6 md:mb-8">Analise seu texto e obtenha estatísticas detalhadas</p>

      <!-- Input Area -->
      <div class="mb-6 md:mb-8">
        <label class="block text-xs md:text-sm font-semibold text-gray-300 mb-2 md:mb-3">
          Cole ou digite seu texto aqui:
        </label>
        <textarea
          v-model="inputText"
          placeholder="Digite seu texto aqui... (máximo 10000 caracteres)"
          maxlength="10000"
          class="w-full h-40 md:h-56 bg-dark-900 border border-dark-700 rounded-lg p-3 md:p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm md:text-base"
        ></textarea>
        <div class="text-right text-xs text-gray-400 mt-2">
          {{ inputText.length }} / 10000
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
        <div class="bg-dark-900 rounded-lg p-3 md:p-4 border border-dark-700">
          <p class="text-gray-400 text-xs md:text-sm mb-2">Total</p>
          <p class="text-2xl md:text-3xl font-bold text-blue-400">{{ stats.total }}</p>
          <p class="text-xs text-gray-500 mt-1">caracteres</p>
        </div>

        <div class="bg-dark-900 rounded-lg p-3 md:p-4 border border-dark-700">
          <p class="text-gray-400 text-xs md:text-sm mb-2">Sem Espaços</p>
          <p class="text-2xl md:text-3xl font-bold text-green-400">{{ stats.withoutSpaces }}</p>
          <p class="text-xs text-gray-500 mt-1">caracteres</p>
        </div>

        <div class="bg-dark-900 rounded-lg p-3 md:p-4 border border-dark-700">
          <p class="text-gray-400 text-xs md:text-sm mb-2">Palavras</p>
          <p class="text-2xl md:text-3xl font-bold text-purple-400">{{ stats.words }}</p>
          <p class="text-xs text-gray-500 mt-1">palavras</p>
        </div>

        <div class="bg-dark-900 rounded-lg p-3 md:p-4 border border-dark-700">
          <p class="text-gray-400 text-xs md:text-sm mb-2">Linhas</p>
          <p class="text-2xl md:text-3xl font-bold text-yellow-400">{{ stats.lines }}</p>
          <p class="text-xs text-gray-500 mt-1">linhas</p>
        </div>
      </div>

      <!-- Detailed Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
        <div class="bg-dark-900 rounded-lg p-3 md:p-4 border border-dark-700">
          <div class="flex justify-between items-center mb-3">
            <p class="text-gray-400 text-xs md:text-sm font-semibold">Letras</p>
            <span class="text-xl md:text-2xl font-bold text-blue-400">{{ stats.letters }}</span>
          </div>
          <div class="w-full bg-dark-800 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all"
              :style="{ width: getPercentage(stats.letters) }"
            ></div>
          </div>
        </div>

        <div class="bg-dark-900 rounded-lg p-3 md:p-4 border border-dark-700">
          <div class="flex justify-between items-center mb-3">
            <p class="text-gray-400 text-xs md:text-sm font-semibold">Números</p>
            <span class="text-xl md:text-2xl font-bold text-green-400">{{ stats.numbers }}</span>
          </div>
          <div class="w-full bg-dark-800 rounded-full h-2">
            <div
              class="bg-green-500 h-2 rounded-full transition-all"
              :style="{ width: getPercentage(stats.numbers) }"
            ></div>
          </div>
        </div>

        <div class="bg-dark-900 rounded-lg p-3 md:p-4 border border-dark-700">
          <div class="flex justify-between items-center mb-3">
            <p class="text-gray-400 text-xs md:text-sm font-semibold">Espaços</p>
            <span class="text-xl md:text-2xl font-bold text-purple-400">{{ stats.spaces }}</span>
          </div>
          <div class="w-full bg-dark-800 rounded-full h-2">
            <div
              class="bg-purple-500 h-2 rounded-full transition-all"
              :style="{ width: getPercentage(stats.spaces) }"
            ></div>
          </div>
        </div>

        <div class="bg-dark-900 rounded-lg p-3 md:p-4 border border-dark-700">
          <div class="flex justify-between items-center mb-3">
            <p class="text-gray-400 text-xs md:text-sm font-semibold">Caracteres Especiais</p>
            <span class="text-xl md:text-2xl font-bold text-orange-400">{{ stats.special }}</span>
          </div>
          <div class="w-full bg-dark-800 rounded-full h-2">
            <div
              class="bg-orange-500 h-2 rounded-full transition-all"
              :style="{ width: getPercentage(stats.special) }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <button
          @click="copyStats"
          class="btn-primary flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4 py-2 md:py-2"
        >
          📋 <span class="hidden sm:inline">Copiar Stats</span><span class="sm:hidden">Stats</span>
        </button>
        <button
          @click="copyText"
          class="btn-primary flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4 py-2 md:py-2"
        >
          📄 <span class="hidden sm:inline">Copiar Texto</span><span class="sm:hidden">Texto</span>
        </button>
        <button
          @click="downloadStats"
          class="btn-primary flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4 py-2 md:py-2"
        >
          💾 <span class="hidden sm:inline">Download</span><span class="sm:hidden">Baixar</span>
        </button>
        <button
          @click="clearText"
          class="btn-secondary flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4 py-2 md:py-2"
        >
          🗑️ <span class="hidden sm:inline">Limpar</span><span class="sm:hidden">Limpar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { countCharacters, countWords, countLines, copyToClipboard, downloadFile } from '@/utils/helpers'
import { useClipboard, useDownload, useNotification } from '@/composables'

const inputText = ref('')
const { copy } = useClipboard()
const { download } = useDownload()
const { notify } = useNotification()

const stats = computed(() => {
  const chars = countCharacters(inputText.value)
  const words = countWords(inputText.value)
  const lines = countLines(inputText.value)

  return {
    total: chars.total,
    withoutSpaces: chars.withoutSpaces,
    letters: chars.letters,
    numbers: chars.numbers,
    spaces: chars.spaces,
    special: chars.special,
    words: words,
    lines: lines,
  }
})

const getPercentage = (value) => {
  if (stats.value.total === 0) return '0%'
  return `${(value / stats.value.total) * 100}%`
}

const copyStats = async () => {
  const statsText = `
📊 ESTATÍSTICAS DE TEXTO

📈 Contadores:
  • Total de caracteres: ${stats.value.total}
  • Sem espaços: ${stats.value.withoutSpaces}
  • Palavras: ${stats.value.words}
  • Linhas: ${stats.value.lines}

🔤 Detalhes:
  • Letras: ${stats.value.letters}
  • Números: ${stats.value.numbers}
  • Espaços: ${stats.value.spaces}
  • Caracteres especiais: ${stats.value.special}

📅 Gerado em: ${new Date().toLocaleString('pt-BR')}
  `.trim()

  await copy(statsText)
}

const copyText = async () => {
  await copy(inputText.value)
}

const downloadStats = () => {
  const data = {
    texto: inputText.value,
    timestamp: new Date().toISOString(),
    estatisticas: {
      totalCaracteres: stats.value.total,
      semEspacos: stats.value.withoutSpaces,
      palavras: stats.value.words,
      linhas: stats.value.lines,
      letras: stats.value.letters,
      numeros: stats.value.numbers,
      espacos: stats.value.spaces,
      caracteresEspeciais: stats.value.special,
    },
  }

  const json = JSON.stringify(data, null, 2)
  downloadFile(json, `analise-texto-${Date.now()}.json`, 'application/json')
}

const clearText = () => {
  inputText.value = ''
  notify.success('Texto limpo!')
}

</script>

<style scoped></style>
