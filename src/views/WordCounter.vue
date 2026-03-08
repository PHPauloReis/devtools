<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Contador de Palavras</h1>
      <p class="text-gray-400 mb-8">Analise palavras, frequência e estatísticas de leitura</p>

      <!-- Input Area -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Cole ou digite seu texto aqui:
        </label>
        <textarea
          v-model="inputText"
          placeholder="Digite seu texto aqui..."
          class="w-full h-56 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <!-- Main Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
          <p class="text-gray-400 text-sm mb-2">Palavras</p>
          <p class="text-3xl font-bold text-blue-400">{{ stats.totalWords }}</p>
          <p class="text-xs text-gray-500 mt-1">total</p>
        </div>

        <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
          <p class="text-gray-400 text-sm mb-2">Únicas</p>
          <p class="text-3xl font-bold text-green-400">{{ stats.uniqueWords }}</p>
          <p class="text-xs text-gray-500 mt-1">distintas</p>
        </div>

        <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
          <p class="text-gray-400 text-sm mb-2">Média/Palavra</p>
          <p class="text-3xl font-bold text-purple-400">{{ stats.avgWordLength }}</p>
          <p class="text-xs text-gray-500 mt-1">caracteres</p>
        </div>

        <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
          <p class="text-gray-400 text-sm mb-2">Linhas</p>
          <p class="text-3xl font-bold text-yellow-400">{{ stats.lines }}</p>
          <p class="text-xs text-gray-500 mt-1">linhas</p>
        </div>
      </div>

      <!-- Reading Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
          <div class="flex justify-between items-center mb-3">
            <p class="text-gray-400 text-sm font-semibold">Tempo de Leitura</p>
            <span class="text-2xl font-bold text-cyan-400">{{ stats.readingTime }}</span>
          </div>
          <p class="text-xs text-gray-500">Baseado em 200 palavras/min</p>
        </div>

        <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
          <div class="flex justify-between items-center mb-3">
            <p class="text-gray-400 text-sm font-semibold">Palavra Mais Longa</p>
            <span class="text-2xl font-bold text-green-400">{{ stats.longestWord }}</span>
          </div>
          <p class="text-xs text-gray-500">{{ stats.longestWordLength }} caracteres</p>
        </div>

        <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
          <div class="flex justify-between items-center mb-3">
            <p class="text-gray-400 text-sm font-semibold">Diversidade</p>
            <span class="text-2xl font-bold text-blue-400">{{ stats.diversity }}%</span>
          </div>
          <div class="w-full bg-dark-800 rounded-full h-2 mt-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all"
              :style="{ width: stats.diversity + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 border-b border-dark-700">
        <button
          @click="activeTab = 'frequency'"
          :class="{
            'text-blue-400 border-b-2 border-blue-400': activeTab === 'frequency',
            'text-gray-400 hover:text-white': activeTab !== 'frequency',
          }"
          class="px-4 py-2 transition-colors"
        >
          📊 Palavras Frequentes
        </button>
        <button
          @click="activeTab = 'details'"
          :class="{
            'text-blue-400 border-b-2 border-blue-400': activeTab === 'details',
            'text-gray-400 hover:text-white': activeTab !== 'details',
          }"
          class="px-4 py-2 transition-colors"
        >
          📈 Detalhes
        </button>
      </div>

      <!-- Frequency Tab -->
      <div v-show="activeTab === 'frequency'" class="mb-8">
        <div class="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden">
          <div class="max-h-96 overflow-y-auto">
            <table class="w-full text-sm">
              <thead class="bg-dark-800 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-gray-400 font-semibold">Palavra</th>
                  <th class="px-4 py-3 text-center text-gray-400 font-semibold">Frequência</th>
                  <th class="px-4 py-3 text-right text-gray-400 font-semibold">%</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in topWords"
                  :key="index"
                  class="border-t border-dark-700 hover:bg-dark-800 transition-colors"
                >
                  <td class="px-4 py-3 text-white">{{ item.word }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-block bg-blue-600/20 text-blue-400 px-3 py-1 rounded">
                      {{ item.count }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right text-gray-400">
                    {{ item.percentage }}%
                  </td>
                </tr>
                <tr v-if="topWords.length === 0" class="border-t border-dark-700">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-400">
                    Nenhuma palavra encontrada
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-3">
          Mostrando as 10 palavras mais frequentes (ignorando palavras com menos de 3 caracteres)
        </p>
      </div>

      <!-- Details Tab -->
      <div v-show="activeTab === 'details'" class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
            <h3 class="text-sm font-semibold text-white mb-4">Comprimento das Palavras</h3>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Mínimo</span>
                  <span>{{ stats.minWordLength }} letras</span>
                </div>
                <div class="w-full bg-dark-800 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 25%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Médio</span>
                  <span>{{ stats.avgWordLength }} letras</span>
                </div>
                <div class="w-full bg-dark-800 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 60%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Máximo</span>
                  <span>{{ stats.longestWordLength }} letras</span>
                </div>
                <div class="w-full bg-dark-800 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full" style="width: 100%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-dark-900 rounded-lg p-4 border border-dark-700">
            <h3 class="text-sm font-semibold text-white mb-4">Informações Gerais</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Total de caracteres:</span>
                <span class="text-white font-semibold">{{ stats.characters }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Caracteres sem espaço:</span>
                <span class="text-white font-semibold">{{ stats.charactersNoSpace }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Parágrafos:</span>
                <span class="text-white font-semibold">{{ stats.paragraphs }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Sentençase estimadas:</span>
                <span class="text-white font-semibold">{{ stats.sentences }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
        <button
          @click="copyStats"
          class="btn-primary flex items-center justify-center gap-2 text-sm"
        >
          📋 Copiar Stats
        </button>
        <button
          @click="copyText"
          class="btn-primary flex items-center justify-center gap-2 text-sm"
        >
          📄 Copiar Texto
        </button>
        <button
          @click="downloadStats"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { countWords, countLines, copyToClipboard, downloadFile } from '@/utils/helpers'
import { useClipboard, useDownload, useNotification } from '@/composables'

const inputText = ref('')
const activeTab = ref('frequency')
const { copy } = useClipboard()
const { download } = useDownload()
const { notify } = useNotification()

const getWordFrequency = (text) => {
  if (!text.trim()) return {}

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length >= 3)

  const frequency = {}
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })

  return frequency
}

const stats = computed(() => {
  const words = inputText.value.trim().split(/\s+/).filter(w => w.length > 0)
  const totalWords = words.length
  const frequency = getWordFrequency(inputText.value)
  const uniqueWords = Object.keys(frequency).length

  const characters = inputText.value.length
  const charactersNoSpace = inputText.value.replace(/\s/g, '').length
  const lines = countLines(inputText.value)
  const paragraphs = inputText.value.split(/\n\s*\n/).filter(p => p.trim()).length

  // Calcular comprimento médio de palavras
  let totalChars = 0
  let wordCount = 0
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '')
    if (cleanWord.length > 0) {
      totalChars += cleanWord.length
      wordCount++
    }
  })
  const avgWordLength = wordCount > 0 ? (totalChars / wordCount).toFixed(1) : 0

  // Encontrar palavra mais longa
  let longestWord = ''
  let longestWordLength = 0
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '')
    if (cleanWord.length > longestWordLength) {
      longestWordLength = cleanWord.length
      longestWord = cleanWord
    }
  })

  // Comprimento mínimo
  let minWordLength = Infinity
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '')
    if (cleanWord.length > 0 && cleanWord.length < minWordLength) {
      minWordLength = cleanWord.length
    }
  })
  minWordLength = minWordLength === Infinity ? 0 : minWordLength

  // Tempo de leitura (200 palavras por minuto)
  const readingTimeMinutes = Math.ceil(totalWords / 200)
  const readingTime = readingTimeMinutes < 1 ? '< 1 min' : `${readingTimeMinutes} min`

  // Diversidade de palavras (única / total)
  const diversity = totalWords > 0 ? Math.round((uniqueWords / totalWords) * 100) : 0

  // Sentença estimadas (pontuação)
  const sentences = (inputText.value.match(/[.!?]/g) || []).length || 1

  return {
    totalWords,
    uniqueWords,
    avgWordLength,
    lines,
    characters,
    charactersNoSpace,
    paragraphs,
    readingTime,
    longestWord,
    longestWordLength,
    minWordLength,
    diversity,
    sentences,
  }
})

const topWords = computed(() => {
  const frequency = getWordFrequency(inputText.value)
  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const total = stats.value.totalWords
  return sorted.map(([word, count]) => ({
    word,
    count,
    percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
  }))
})

const copyStats = async () => {
  const statsText = `
📊 ANÁLISE DE PALAVRAS

📈 Contadores:
  • Total de palavras: ${stats.value.totalWords}
  • Palavras únicas: ${stats.value.uniqueWords}
  • Média por palavra: ${stats.value.avgWordLength} caracteres
  • Linhas: ${stats.value.lines}

📖 Leitura:
  • Tempo estimado: ${stats.value.readingTime}
  • Diversidade: ${stats.value.diversity}%

🔤 Palavras:
  • Mais longa: ${stats.value.longestWord} (${stats.value.longestWordLength} letras)
  • Mais curta: ${stats.value.minWordLength} letras
  • Média: ${stats.value.avgWordLength} letras

📝 Estrutura:
  • Parágrafos: ${stats.value.paragraphs}
  • Sentenças: ${stats.value.sentences}
  • Caracteres: ${stats.value.characters}
  • Sem espaço: ${stats.value.charactersNoSpace}

📅 Gerado em: ${new Date().toLocaleString('pt-BR')}
  `.trim()

  await copy(statsText)
}

const copyText = async () => {
  await copy(inputText.value)
}

const downloadStats = () => {
  const frequency = getWordFrequency(inputText.value)
  const frequencySorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [word, count]) => {
      acc[word] = count
      return acc
    }, {})

  const data = {
    texto: inputText.value,
    timestamp: new Date().toISOString(),
    estatisticas: {
      totalPalavras: stats.value.totalWords,
      palavrasUnicas: stats.value.uniqueWords,
      mediaCaracteresPorPalavra: stats.value.avgWordLength,
      linhas: stats.value.lines,
      caracteres: stats.value.characters,
      caractereSemEspaco: stats.value.charactersNoSpace,
      paragrafos: stats.value.paragraphs,
      sentencas: stats.value.sentences,
      diversidade: stats.value.diversity,
      tempoLeitura: stats.value.readingTime,
      palavraMaisLonga: `${stats.value.longestWord} (${stats.value.longestWordLength} letras)`,
    },
    frequenciaPalavras: frequencySorted,
  }

  const json = JSON.stringify(data, null, 2)
  downloadFile(json, `analise-palavras-${Date.now()}.json`, 'application/json')
}

const clearText = () => {
  inputText.value = ''
  notify.success('Texto limpo!')
}

</script>

<style scoped></style>
