<template>
  <div class="max-w-7xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Diff Checker</h1>
      <p class="text-gray-400 mb-8">Compare dois textos e visualize as diferenças</p>

      <!-- Inputs Container -->
      <div class="grid grid-cols-2 gap-6 mb-8">
        <!-- Text 1 -->
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Texto Original
          </label>
          <textarea
            v-model="text1"
            placeholder="Cole o primeiro texto aqui..."
            class="w-full h-64 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
          ></textarea>
          <div class="text-right text-xs text-gray-400 mt-2">
            {{ text1.length }} caracteres
          </div>
        </div>

        <!-- Text 2 -->
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Texto Modificado
          </label>
          <textarea
            v-model="text2"
            placeholder="Cole o segundo texto aqui..."
            class="w-full h-64 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
          ></textarea>
          <div class="text-right text-xs text-gray-400 mt-2">
            {{ text2.length }} caracteres
          </div>
        </div>
      </div>

      <!-- Diff Type Selector -->
      <div class="mb-6 flex gap-4">
        <label class="flex items-center cursor-pointer">
          <input
            v-model="diffType"
            type="radio"
            value="lines"
            class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm font-medium text-gray-300">Comparar por Linhas</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            v-model="diffType"
            type="radio"
            value="words"
            class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm font-medium text-gray-300">Comparar por Palavras</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            v-model="diffType"
            type="radio"
            value="characters"
            class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm font-medium text-gray-300">Comparar por Caracteres</span>
        </label>
      </div>

      <!-- Stats -->
      <div v-if="text1 && text2" class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-dark-800 border border-dark-700 rounded-lg p-4">
          <div class="text-xs text-gray-400 mb-1">Linhas Adicionadas</div>
          <div class="text-2xl font-bold text-green-400">{{ stats.added }}</div>
        </div>
        <div class="bg-dark-800 border border-dark-700 rounded-lg p-4">
          <div class="text-xs text-gray-400 mb-1">Linhas Removidas</div>
          <div class="text-2xl font-bold text-red-400">{{ stats.removed }}</div>
        </div>
        <div class="bg-dark-800 border border-dark-700 rounded-lg p-4">
          <div class="text-xs text-gray-400 mb-1">Similaridade</div>
          <div class="text-2xl font-bold text-blue-400">{{ stats.similarity }}%</div>
        </div>
      </div>

      <!-- Diff Output -->
      <div v-if="text1 && text2" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Visualização de Diferenças
        </label>
        <div class="bg-dark-900 border border-dark-700 rounded-lg p-4 overflow-auto max-h-96 font-mono text-sm">
          <div v-if="diffType === 'lines'" class="space-y-1">
            <div v-for="(line, idx) in diffLines" :key="idx" class="flex">
              <span class="w-6 text-right pr-3 text-gray-600">{{ idx + 1 }}</span>
              <span
                :class="{
                  'text-green-400': line.type === 'added',
                  'text-red-400': line.type === 'removed',
                  'text-gray-400': line.type === 'unchanged',
                  'bg-green-500/10': line.type === 'added',
                  'bg-red-500/10': line.type === 'removed'
                }"
                class="flex-1 px-2 py-1 rounded"
              >
                <span v-if="line.type === 'added'" class="mr-2">+</span>
                <span v-else-if="line.type === 'removed'" class="mr-2">-</span>
                <span v-else class="mr-2"> </span>
                {{ line.content }}
              </span>
            </div>
          </div>

          <div v-else-if="diffType === 'words'" class="space-y-2">
            <div v-for="(line, idx) in diffWords" :key="idx" class="flex flex-wrap gap-1">
              <span class="w-6 text-right pr-3 text-gray-600 block">{{ idx + 1 }}</span>
              <span class="flex-1">
                <span
                  v-for="(word, widx) in line.words"
                  :key="widx"
                  :class="{
                    'text-green-400 bg-green-500/20': word.type === 'added',
                    'text-red-400 bg-red-500/20': word.type === 'removed',
                    'text-gray-400': word.type === 'unchanged'
                  }"
                  class="px-1 py-0.5 rounded inline-block mr-1"
                >
                  {{ word.content }}
                </span>
              </span>
            </div>
          </div>

          <div v-else-if="diffType === 'characters'" class="whitespace-pre-wrap break-words">
            <span
              v-for="(char, idx) in diffCharacters"
              :key="idx"
              :class="{
                'text-green-400 bg-green-500/20': char.type === 'added',
                'text-red-400 bg-red-500/20': char.type === 'removed',
                'text-gray-400': char.type === 'unchanged'
              }"
              class="px-0.5 rounded"
            >
              {{ char.content === '\n' ? '↵\n' : char.content }}
            </span>
          </div>
        </div>
      </div>

      <!-- Clear Button -->
      <div v-if="text1 || text2" class="text-right">
        <button
          @click="clear"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
        >
          Limpar Tudo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const text1 = ref('')
const text2 = ref('')
const diffType = ref('lines')

const clear = () => {
  text1.value = ''
  text2.value = ''
}

// Parse text into lines
const lines1 = computed(() => text1.value.split('\n'))
const lines2 = computed(() => text2.value.split('\n'))

// Simple diff algorithm
const computeDiff = (arr1, arr2) => {
  const result = []
  const m = arr1.length
  const n = arr2.length

  // Create LCS (Longest Common Subsequence) table
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to find the diff
  let i = m,
    j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && arr1[i - 1] === arr2[j - 1]) {
      result.unshift({ content: arr1[i - 1], type: 'unchanged' })
      i--
      j--
    } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
      result.unshift({ content: arr1[i - 1], type: 'removed' })
      i--
    } else if (j > 0) {
      result.unshift({ content: arr2[j - 1], type: 'added' })
      j--
    }
  }

  return result
}

// Diff by lines
const diffLines = computed(() => {
  if (!text1.value || !text2.value) return []
  return computeDiff(lines1.value, lines2.value)
})

// Diff by words
const diffWords = computed(() => {
  if (!text1.value || !text2.value) return []
  const words1 = text1.value.match(/\S+|\n/g) || []
  const words2 = text2.value.match(/\S+|\n/g) || []
  const diff = computeDiff(words1, words2)

  // Group by lines
  const grouped = []
  let currentLine = []

  for (const item of diff) {
    if (item.content === '\n') {
      if (currentLine.length > 0) {
        grouped.push({ words: currentLine })
        currentLine = []
      }
    } else {
      currentLine.push(item)
    }
  }

  if (currentLine.length > 0) {
    grouped.push({ words: currentLine })
  }

  return grouped.length > 0 ? grouped : [{ words: diff }]
})

// Diff by characters
const diffCharacters = computed(() => {
  if (!text1.value || !text2.value) return []
  const chars1 = text1.value.split('')
  const chars2 = text2.value.split('')
  return computeDiff(chars1, chars2)
})

// Calculate statistics
const stats = computed(() => {
  let added = 0
  let removed = 0

  if (diffType.value === 'lines') {
    diffLines.value.forEach((line) => {
      if (line.type === 'added') added++
      if (line.type === 'removed') removed++
    })
  } else if (diffType.value === 'words') {
    diffWords.value.forEach((line) => {
      line.words.forEach((word) => {
        if (word.type === 'added') added++
        if (word.type === 'removed') removed++
      })
    })
  }

  const similarity =
    text1.value.length + text2.value.length > 0
      ? Math.round(
          ((text1.value.length + text2.value.length -
            (added + removed) * (diffType.value === 'lines' ? 50 : 1)) /
            (text1.value.length + text2.value.length)) *
            100
        )
      : 0

  return {
    added: Math.max(0, added),
    removed: Math.max(0, removed),
    similarity: Math.max(0, Math.min(100, similarity))
  }
})
</script>

<style scoped></style>
