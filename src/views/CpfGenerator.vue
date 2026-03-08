<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Gerador de CPF</h1>
      <p class="text-gray-400 mb-8">Gere CPFs válidos e fictícios para testes</p>

      <!-- Info Box -->
      <div class="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4 mb-8">
        <h3 class="text-sm font-semibold text-yellow-400 mb-2">⚠️ Aviso Importante</h3>
        <p class="text-sm text-gray-300">
          Este gerador cria CPFs válidos apenas para fins de teste e desenvolvimento. Não use em produção ou para qualquer fim ilegal.
        </p>
      </div>

      <!-- Generation Options -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Formato de Saída:
          </label>
          <select
            v-model="outputFormat"
            class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="formatted">Formatado (XXX.XXX.XXX-XX)</option>
            <option value="unformatted">Sem Formatação (XXXXXXXXXXX)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Quantidade a Gerar:
          </label>
          <input
            v-model.number="quantityToGenerate"
            type="number"
            min="1"
            max="100"
            class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div class="flex items-end">
          <button
            @click="generateCpfs"
            class="w-full btn-primary flex items-center justify-center gap-2"
          >
            🎲 Gerar CPF(s)
          </button>
        </div>
      </div>

      <!-- Generated CPFs Section -->
      <div v-if="generatedCpfs.length > 0" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          CPF(s) Gerado(s) ({{ generatedCpfs.length }}):
        </label>
        <div class="bg-dark-900 border border-dark-700 rounded-lg p-6">
          <!-- Single CPF Display -->
          <div v-if="generatedCpfs.length === 1" class="text-center">
            <div class="bg-dark-800 rounded-lg p-6 mb-4">
              <p class="text-gray-400 text-sm mb-2">CPF Gerado:</p>
              <p class="text-3xl font-bold text-green-400 font-mono tracking-wider">
                {{ generatedCpfs[0] }}
              </p>
            </div>

            <!-- Single CPF Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                @click="copyCpf(generatedCpfs[0])"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                📋 Copiar
              </button>
              <button
                @click="generateCpfs"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                🔄 Gerar Novo
              </button>
              <button
                @click="downloadCpf"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                💾 Download
              </button>
            </div>
          </div>

          <!-- Multiple CPFs Display -->
          <div v-else>
            <div class="max-h-96 overflow-y-auto mb-4">
              <div
                v-for="(cpf, index) in generatedCpfs"
                :key="index"
                class="flex items-center justify-between bg-dark-800 rounded-lg p-3 mb-2"
              >
                <div>
                  <p class="text-gray-400 text-xs">CPF #{{ index + 1 }}</p>
                  <p class="text-green-400 font-mono font-semibold">{{ cpf }}</p>
                </div>
                <button
                  @click="copyCpf(cpf)"
                  class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                >
                  📋
                </button>
              </div>
            </div>

            <!-- Multiple CPFs Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                @click="copyAll"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                📋 Copiar Todos
              </button>
              <button
                @click="downloadAll"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                💾 Download CSV
              </button>
              <button
                @click="clearCpfs"
                class="btn-secondary flex items-center justify-center gap-2 text-sm"
              >
                🗑️ Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-dark-900 rounded-lg border border-dark-700">
        <p class="text-gray-400 text-lg">🎲 Clique em "Gerar CPF(s)" para começar</p>
      </div>
    </div>

    <!-- Validator Section -->
    <div class="mt-8">
      <div class="card">
        <h2 class="text-2xl font-bold text-white mb-2">Validador de CPF</h2>
        <p class="text-gray-400 mb-8">Valide um CPF para verificar se é válido</p>

        <!-- Validator Input -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Digite um CPF para validar:
          </label>
          <input
            v-model="cpfToValidate"
            type="text"
            placeholder="000.000.000-00 ou 00000000000"
            class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>

        <!-- Validation Result -->
        <div v-if="cpfToValidate.trim()" class="mb-8">
          <div v-if="isValidCpf(cpfToValidate)" class="bg-green-600/10 border border-green-600/20 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <div class="text-4xl">✅</div>
              <div>
                <p class="text-green-400 font-semibold text-lg">CPF Válido!</p>
                <p class="text-gray-300 text-sm">Este CPF passa na validação de dígito verificador</p>
              </div>
            </div>
          </div>

          <div v-else class="bg-red-600/10 border border-red-600/20 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <div class="text-4xl">❌</div>
              <div>
                <p class="text-red-400 font-semibold text-lg">CPF Inválido!</p>
                <p class="text-gray-300 text-sm">{{ validationError }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClipboard, useNotification } from '@/composables'

const generatedCpfs = ref([])
const outputFormat = ref('formatted')
const quantityToGenerate = ref(1)
const cpfToValidate = ref('')
const { copy } = useClipboard()
const { notify } = useNotification()

// Função para calcular dígitos verificadores
const calculateCheckDigits = (cpfDigits) => {
  const digits = cpfDigits.slice(0, 9)
  
  // Primeiro dígito verificador
  let sum1 = 0
  for (let i = 0; i < 9; i++) {
    sum1 += digits[i] * (10 - i)
  }
  const remainder1 = sum1 % 11
  const digit1 = remainder1 < 2 ? 0 : 11 - remainder1
  
  // Segundo dígito verificador
  let sum2 = 0
  for (let i = 0; i < 9; i++) {
    sum2 += digits[i] * (11 - i)
  }
  sum2 += digit1 * 2
  const remainder2 = sum2 % 11
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2
  
  return [digit1, digit2]
}

// Função para gerar CPF válido
const generateValidCpf = () => {
  // Gera 9 dígitos aleatórios
  const digits = []
  for (let i = 0; i < 9; i++) {
    digits.push(Math.floor(Math.random() * 10))
  }
  
  // Calcula os dígitos verificadores
  const [digit1, digit2] = calculateCheckDigits(digits)
  
  // Monta o CPF
  const cpf = [...digits, digit1, digit2]
  const cpfUnformatted = cpf.join('')
  
  // Formata se necessário
  if (outputFormat.value === 'formatted') {
    return `${cpf.slice(0, 3).join('')}.${cpf.slice(3, 6).join('')}.${cpf.slice(6, 9).join('')}-${cpf.slice(9).join('')}`
  }
  
  return cpfUnformatted
}

// Função para validar CPF
const isValidCpf = (cpf) => {
  // Verifica se contém apenas dígitos, pontos e hífens
  if (!/^[\d.\-]*$/.test(cpf)) return false
  
  // Remove formatação
  const cleanCpf = cpf.replace(/\D/g, '')
  
  // Verifica tamanho
  if (cleanCpf.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false
  
  // Calcula dígitos verificadores
  const digits = cleanCpf.split('').map(Number)
  const [digit1Expected, digit2Expected] = calculateCheckDigits(digits)
  
  return digits[9] === digit1Expected && digits[10] === digit2Expected
}

// Computed para validação
const validationError = computed(() => {
  if (!cpfToValidate.value.trim()) return ''
  
  // Valida caracteres permitidos
  if (!/^[\d.\-]*$/.test(cpfToValidate.value)) {
    return 'CPF contém caracteres inválidos. Use apenas dígitos, pontos e hífens.'
  }
  
  const cleanCpf = cpfToValidate.value.replace(/\D/g, '')
  
  if (cleanCpf.length !== 11) {
    return `CPF deve ter 11 dígitos (encontrados ${cleanCpf.length})`
  }
  
  if (/^(\d)\1{10}$/.test(cleanCpf)) {
    return 'CPF com todos os dígitos iguais é inválido'
  }
  
  return 'Os dígitos verificadores estão incorretos'
})

// Função para gerar CPFs
const generateCpfs = () => {
  generatedCpfs.value = []
  const quantity = Math.min(quantityToGenerate.value, 100) // Limita a 100
  
  for (let i = 0; i < quantity; i++) {
    generatedCpfs.value.push(generateValidCpf())
  }
  
  if (quantity === 1) {
    notify.success('CPF gerado com sucesso!')
  } else {
    notify.success(`${quantity} CPFs gerados com sucesso!`)
  }
}

// Função para copiar CPF individual
const copyCpf = async (cpf) => {
  await copy(cpf)
  notify.success('CPF copiado!')
}

// Função para copiar todos os CPFs
const copyAll = async () => {
  const text = generatedCpfs.value.join('\n')
  await copy(text)
  notify.success('Todos os CPFs copiados!')
}

// Função para limpar CPFs
const clearCpfs = () => {
  generatedCpfs.value = []
  notify.success('Lista limpa!')
}

// Função para download CPF único
const downloadCpf = () => {
  const cpf = generatedCpfs.value[0]
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(cpf)}`
  )
  element.setAttribute('download', `cpf-${Date.now()}.txt`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('CPF baixado!')
}

// Função para download múltiplos CPFs
const downloadAll = () => {
  // Cria CSV
  const csv = 'CPF\n' + generatedCpfs.value.join('\n')
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
  )
  element.setAttribute('download', `cpfs-${Date.now()}.csv`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('CPFs baixados como CSV!')
}
</script>

<style scoped></style>
