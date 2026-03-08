<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Testador de Regex</h1>
      <p class="text-gray-400 mb-8">Teste e valide expressões regulares com facilidade</p>

      <!-- Regex Input -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Digite a expressão regular (Regex):
        </label>
        <div class="flex gap-2">
          <input
            v-model="regexPattern"
            type="text"
            placeholder="/^[a-z]+$/i"
            class="flex-1 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
          />
          <button
            v-if="regexError"
            @click="copyRegex"
            title="Regex inválida"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            ❌
          </button>
          <button
            v-else
            @click="copyRegex"
            title="Regex válida"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            ✅
          </button>
        </div>
        <div v-if="regexError" class="text-red-400 text-xs mt-2">
          {{ regexError }}
        </div>
        <div v-else-if="regexPattern" class="text-green-400 text-xs mt-2">
          ✓ Regex válida
        </div>
      </div>

      <!-- Flags -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Flags:
        </label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="flags"
              type="checkbox"
              value="g"
              class="w-4 h-4 rounded"
            />
            <span class="text-sm text-gray-300">g - Global</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="flags"
              type="checkbox"
              value="i"
              class="w-4 h-4 rounded"
            />
            <span class="text-sm text-gray-300">i - Case Insensitive</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="flags"
              type="checkbox"
              value="m"
              class="w-4 h-4 rounded"
            />
            <span class="text-sm text-gray-300">m - Multiline</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="flags"
              type="checkbox"
              value="s"
              class="w-4 h-4 rounded"
            />
            <span class="text-sm text-gray-300">s - DotAll</span>
          </label>
        </div>
      </div>

      <!-- Test Text Area -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Texto de teste:
        </label>
        <textarea
          v-model="testText"
          placeholder="Digite o texto para testar a regex..."
          class="w-full h-40 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
        ></textarea>
        <div class="text-right text-xs text-gray-400 mt-2">
          {{ testText.length }} caracteres
        </div>

        <!-- Highlight Preview -->
        <div v-if="regexPattern && !regexError && matches.length > 0" class="mt-4">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Preview com Highlights:
          </label>
          <div class="bg-dark-900 text-gray-400 border border-dark-700 rounded-lg p-4 font-mono text-sm max-h-40 overflow-y-auto whitespace-pre-wrap break-words leading-relaxed">
            <span v-html="highlightedText"></span>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="regexPattern && !regexError && testText" class="mb-8">
        <!-- Status -->
        <div class="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-gray-400 text-xs mb-1">Total de Matches</p>
              <p class="text-blue-400 font-bold text-2xl">{{ matchCount }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs mb-1">Primeira Ocorrência</p>
              <p class="text-green-400 font-mono text-sm break-all">{{ firstMatch || 'Nenhuma' }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs mb-1">Última Ocorrência</p>
              <p class="text-purple-400 font-mono text-sm break-all">{{ lastMatch || 'Nenhuma' }}</p>
            </div>
          </div>
        </div>

        <!-- Matches List -->
        <div v-if="matches.length > 0" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Resultados ({{ matches.length }}):
          </label>
          <div class="bg-dark-900 border border-dark-700 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div v-for="(match, index) in matches" :key="index" class="mb-3 pb-3 border-b border-dark-700 last:border-b-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-gray-400 text-xs mb-1">Match #{{ index + 1 }}</p>
                  <p class="text-green-400 font-mono text-sm bg-dark-800 p-2 rounded break-all">{{ match.value }}</p>
                  <p class="text-gray-500 text-xs mt-1">Posição: {{ match.index }} - {{ match.index + match.value.length }}</p>
                </div>
              </div>
              <div v-if="match.groups && match.groups.length > 0" class="mt-2">
                <p class="text-gray-400 text-xs mb-1">Grupos de Captura:</p>
                <div v-for="(group, gIndex) in match.groups" :key="gIndex" class="text-blue-400 text-xs font-mono ml-2">
                  [{{ gIndex + 1 }}]: {{ group || 'undefined' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Matches -->
        <div v-else class="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4">
          <p class="text-yellow-400 text-sm">
            ⚠️ Nenhum match encontrado para essa regex no texto.
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <button
          @click="copyMatches"
          v-if="matches.length > 0"
          class="btn-primary flex items-center justify-center gap-2 text-sm"
        >
          📋 Copiar Resultados
        </button>
        <button
          @click="clearAll"
          class="btn-secondary flex items-center justify-center gap-2 text-sm"
        >
          🗑️ Limpar
        </button>
      </div>
    </div>

    <!-- Quick Examples -->
    <div class="mt-8">
      <h2 class="text-xl font-bold text-white mb-4">⚡ Exemplos de Regex</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          @click="loadExample('email')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">📧 Email</p>
          <p class="text-xs text-gray-400">Valida endereço de email</p>
        </button>

        <button
          @click="loadExample('cpf')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">🔐 CPF</p>
          <p class="text-xs text-gray-400">Encontra CPF no padrão XXX.XXX.XXX-XX</p>
        </button>

        <button
          @click="loadExample('cnpj')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">🏢 CNPJ</p>
          <p class="text-xs text-gray-400">Encontra CNPJ no padrão XX.XXX.XXX/XXXX-XX</p>
        </button>

        <button
          @click="loadExample('phone')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">📞 Telefone</p>
          <p class="text-xs text-gray-400">Encontra telefone (XX) XXXX-XXXX</p>
        </button>

        <button
          @click="loadExample('date')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">📅 Data</p>
          <p class="text-xs text-gray-400">Encontra data DD/MM/YYYY</p>
        </button>

        <button
          @click="loadExample('url')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">🔗 URL</p>
          <p class="text-xs text-gray-400">Valida endereço de website</p>
        </button>

        <button
          @click="loadExample('number')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">🔢 Número</p>
          <p class="text-xs text-gray-400">Encontra números inteiros e decimais</p>
        </button>

        <button
          @click="loadExample('ipv4')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">🌐 IPv4</p>
          <p class="text-xs text-gray-400">Encontra endereço IP</p>
        </button>

        <button
          @click="loadExample('hex')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">🎨 Cor (Hex)</p>
          <p class="text-xs text-gray-400">Encontra cores em formato hex (#FFF)</p>
        </button>

        <button
          @click="loadExample('word')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">📝 Palavra</p>
          <p class="text-xs text-gray-400">Encontra palavras (letras, números, _)</p>
        </button>

        <button
          @click="loadExample('camelCase')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">🐪 camelCase</p>
          <p class="text-xs text-gray-400">Encontra variáveis em camelCase</p>
        </button>

        <button
          @click="loadExample('html')"
          class="bg-dark-800 border border-dark-700 hover:border-blue-500 rounded-lg p-4 text-left transition-colors"
        >
          <p class="text-sm font-semibold text-white mb-1">🏷️ HTML Tags</p>
          <p class="text-xs text-gray-400">Encontra tags HTML</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClipboard, useNotification } from '@/composables'

const regexPattern = ref('')
const testText = ref('Nosso cliente número 1 é o João Silva. O seu CPF é 542.845.940-95 e o CPF de sua mãe é 611.457.710-84. João nasceu em 15/03/1988 e pode ser contatado pelo telefone (11) 98765-4321 ou pelo e-mail joao.silva@example.com. Atualmente, ele trabalha na empresa Silva Tecnologia Ltda., inscrita no CNPJ 12.345.678/0001-90. O site da empresa é https://www.silvatecnologia.com.br, cuja cor predominante da logo é o hexadecimal #1E73BE, e o IPv4 do site é 203.0.113.45.')
const flags = ref([])
const { copy } = useClipboard()
const { notify } = useNotification()

const regexError = computed(() => {
  if (!regexPattern.value) return ''
  try {
    const pattern = regexPattern.value.startsWith('/') ? regexPattern.value : `/${regexPattern.value}/`
    const parts = pattern.match(/^\/(.*)\/([gimsu]*)$/)
    if (!parts) {
      new RegExp(regexPattern.value, flags.value.join(''))
      return ''
    }
    new RegExp(parts[1], parts[2])
    return ''
  } catch (error) {
    return error.message
  }
})

const regex = computed(() => {
  if (regexError.value || !regexPattern.value) return null
  try {
    let pattern = regexPattern.value
    if (pattern.startsWith('/')) {
      const parts = pattern.match(/^\/(.*)\/([gimsu]*)$/)
      if (parts) {
        return new RegExp(parts[1], parts[2])
      }
    }
    return new RegExp(pattern, flags.value.join(''))
  } catch {
    return null
  }
})

const matches = computed(() => {
  if (!regex.value || !testText.value) return []
  
  const result = []
  const globalRegex = new RegExp(regex.value.source, (regex.value.flags.includes('g') ? regex.value.flags : regex.value.flags + 'g'))
  let match
  
  while ((match = globalRegex.exec(testText.value)) !== null) {
    result.push({
      value: match[0],
      index: match.index,
      groups: match.slice(1)
    })
  }
  
  return result
})

const matchCount = computed(() => matches.value.length)

const firstMatch = computed(() => {
  return matches.value.length > 0 ? matches.value[0].value : ''
})

const lastMatch = computed(() => {
  return matches.value.length > 0 ? matches.value[matches.value.length - 1].value : ''
})

const highlightedText = computed(() => {
  if (matches.value.length === 0 || !testText.value) return ''
  
  const colors = [
    '#4ade80', // green
    '#60a5fa', // blue
    '#fbbf24', // amber
    '#f87171', // red
    '#a78bfa', // purple
    '#2dd4bf', // cyan
    '#fb923c', // orange
    '#ec4899', // pink
  ]
  
  // Criar cópia do texto com todas as posições marcadas
  let result = ''
  let lastIndex = 0
  
  matches.value.forEach((match, colorIndex) => {
    const color = colors[colorIndex % colors.length]
    
    // Adicionar texto antes do match
    result += escapeHtml(testText.value.substring(lastIndex, match.index))
    
    // Adicionar match com highlight
    result += `<span style="background-color: ${color}30; color: ${color}; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${escapeHtml(match.value)}</span>`
    
    lastIndex = match.index + match.value.length
  })
  
  // Adicionar texto restante
  result += escapeHtml(testText.value.substring(lastIndex))
  
  return result
})

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const copyRegex = async () => {
  await copy(regexPattern.value)
  notify.success('Regex copiada!')
}

const copyMatches = async () => {
  const text = matches.value.map((m, i) => `${i + 1}. ${m.value}`).join('\n')
  await copy(text)
  notify.success('Resultados copiados!')
}

const clearAll = () => {
  regexPattern.value = ''
  flags.value = []
  notify.success('Limpo!')
}

const generateTestRegex = () => {
  if (!regexPattern.value) return
  notify.success('Explicação gerada!')
}

const loadExample = (type) => {
  const examples = {
    email: {
      pattern: '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g',
      flags: ['g'],
      explanation: 'Encontra endereços de email no texto'
    },
    cpf: {
      pattern: '/\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}/g',
      flags: ['g'],
      explanation: 'Encontra CPF no padrão XXX.XXX.XXX-XX'
    },
    cnpj: {
      pattern: '/\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}/g',
      flags: ['g'],
      explanation: 'Encontra CNPJ no padrão XX.XXX.XXX/XXXX-XX'
    },
    phone: {
      pattern: '/\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}/g',
      flags: ['g'],
      explanation: 'Encontra telefone (XX) XXXX-XXXX ou (XX) XXXXX-XXXX'
    },
    date: {
      pattern: '/\\d{1,2}\\/\\d{1,2}\\/\\d{4}/g',
      flags: ['g'],
      explanation: 'Encontra datas no formato DD/MM/YYYY'
    },
    url: {
      pattern: '/https?:\\/\\/[^\\s,;:)!?"\']+/g',
      flags: ['g'],
      explanation: 'Encontra URLs (http ou https) no texto'
    },
    number: {
      pattern: '/\\d+(\\.\\d+)?/g',
      flags: ['g'],
      explanation: 'Encontra números inteiros e decimais'
    },
    ipv4: {
      pattern: '/(\\d{1,3}\\.){3}\\d{1,3}/g',
      flags: ['g'],
      explanation: 'Encontra endereços IP (XXX.XXX.XXX.XXX)'
    },
    hex: {
      pattern: '/#([0-9a-f]{3}){1,2}/gi',
      flags: ['g', 'i'],
      explanation: 'Encontra cores em formato hexadecimal (#FFF ou #FFFFFF)'
    },
    word: {
      pattern: '/\\w+/g',
      flags: ['g'],
      explanation: 'Encontra palavras (letras, números, underscore)'
    },
    camelCase: {
      pattern: '/[a-z][a-z0-9]*([A-Z][a-z0-9]*)*/g',
      flags: ['g'],
      explanation: 'Encontra variáveis em camelCase'
    },
    html: {
      pattern: '/<[^>]+>/g',
      flags: ['g'],
      explanation: 'Encontra tags HTML'
    }
  }

  const example = examples[type]
  if (example) {
    regexPattern.value = example.pattern
    flags.value = example.flags
    notify.success(`Exemplo carregado: ${type}`)
  }
}
</script>

<style scoped></style>
