<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Gerador de CNPJ</h1>
      <p class="text-gray-400 mb-8">Gere CNPJs válidos e fictícios para testes</p>

      <!-- Info Box -->
      <div class="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4 mb-8">
        <h3 class="text-sm font-semibold text-yellow-400 mb-2">⚠️ Aviso Importante</h3>
        <p class="text-sm text-gray-300">
          Este gerador cria CNPJs válidos apenas para fins de teste e desenvolvimento. Não use em produção ou para qualquer fim ilegal.
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
            <option value="formatted">Formatado (XX.XXX.XXX/XXXX-XX)</option>
            <option value="unformatted">Sem Formatação (XXXXXXXXXXXXXX)</option>
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
            @click="generateCnpjs"
            class="w-full btn-primary flex items-center justify-center gap-2"
          >
            🎲 Gerar CNPJ(s)
          </button>
        </div>
      </div>

      <!-- Generated CNPJs Section -->
      <div v-if="generatedCnpjs.length > 0" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          CNPJ(s) Gerado(s) ({{ generatedCnpjs.length }}):
        </label>
        <div class="bg-dark-900 border border-dark-700 rounded-lg p-6">
          <!-- Single CNPJ Display -->
          <div v-if="generatedCnpjs.length === 1" class="text-center">
            <div class="bg-dark-800 rounded-lg p-6 mb-4">
              <p class="text-gray-400 text-sm mb-2">CNPJ Gerado:</p>
              <p class="text-3xl font-bold text-green-400 font-mono tracking-wider">
                {{ generatedCnpjs[0] }}
              </p>
            </div>

            <!-- Single CNPJ Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                @click="copyCnpj(generatedCnpjs[0])"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                📋 Copiar
              </button>
              <button
                @click="generateCnpjs"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                🔄 Gerar Novo
              </button>
              <button
                @click="downloadCnpj"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                💾 Download
              </button>
            </div>
          </div>

          <!-- Multiple CNPJs Display -->
          <div v-else>
            <div class="max-h-96 overflow-y-auto mb-4">
              <div
                v-for="(cnpj, index) in generatedCnpjs"
                :key="index"
                class="flex items-center justify-between bg-dark-800 rounded-lg p-3 mb-2"
              >
                <div>
                  <p class="text-gray-400 text-xs">CNPJ {{ index + 1 }}</p>
                  <p class="text-green-400 font-mono font-semibold">{{ cnpj }}</p>
                </div>
                <button
                  @click="copyCnpj(cnpj)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition"
                >
                  Copiar
                </button>
              </div>
            </div>

            <!-- Multiple CNPJs Actions -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                @click="generateCnpjs"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                🔄 Gerar Novos
              </button>
              <button
                @click="clearCnpjs"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                🗑️ Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Separator -->
      <div class="my-12 border-t border-dark-700"></div>

      <!-- Validation Section -->
      <div>
        <h2 class="text-2xl font-bold text-white mb-6">Validador de CNPJ</h2>

        <!-- Validator Input -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Digite um CNPJ para validar:
          </label>
          <input
            v-model="cnpjToValidate"
            type="text"
            placeholder="00.000.000/0000-00 ou 00000000000000"
            class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>

        <!-- Validation Result -->
        <div v-if="cnpjToValidate.trim()" class="mb-8">
          <div v-if="isValidCnpj(cnpjToValidate)" class="bg-green-600/10 border border-green-600/20 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <div class="text-4xl">✅</div>
              <div>
                <p class="text-green-400 font-semibold text-lg">CNPJ Válido!</p>
                <p class="text-gray-300 text-sm">Este CNPJ passa na validação de dígito verificador</p>
              </div>
            </div>
          </div>

          <div v-else class="bg-red-600/10 border border-red-600/20 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <div class="text-4xl">❌</div>
              <div>
                <p class="text-red-400 font-semibold text-lg">CNPJ Inválido!</p>
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
import { isValidCNPJ, calculateCnpjCheckDigits } from '@/utils/helpers'

const generatedCnpjs = ref([])
const outputFormat = ref('formatted')
const quantityToGenerate = ref(1)
const cnpjToValidate = ref('')
const { copy } = useClipboard()
const { notify } = useNotification()

// Função para calcular dígitos verificadores do CNPJ
const calculateCheckDigits = (cnpjDigits) => {
  // Primeiro dígito verificador
  const multipliers1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum1 = 0
  for (let i = 0; i < 12; i++) {
    sum1 += cnpjDigits[i] * multipliers1[i]
  }
  const remainder1 = sum1 % 11
  const digit1 = remainder1 < 2 ? 0 : 11 - remainder1

  // Segundo dígito verificador
  const multipliers2 = [6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9]
  let sum2 = 0
  for (let i = 0; i < 12; i++) {
    sum2 += cnpjDigits[i] * multipliers2[i]
  }
  sum2 += digit1 * 2
  const remainder2 = sum2 % 11
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2

  return [digit1, digit2]
}

// Função para gerar CNPJ válido
const generateValidCnpj = () => {
  // Gera 8 dígitos aleatórios para a parte da empresa
  const companyDigits = []
  for (let i = 0; i < 8; i++) {
    companyDigits.push(Math.floor(Math.random() * 10))
  }

  // Adiciona sequência padrão (0001)
  const sequenceDigits = [0, 0, 0, 1]

  // Monta os 12 primeiros dígitos
  const base12 = [...companyDigits, ...sequenceDigits]

  // Calcula os dígitos verificadores
  const [digit1, digit2] = calculateCheckDigits(base12)

  // Monta o CNPJ completo
  const cnpj = [...base12, digit1, digit2]
  const cnpjUnformatted = cnpj.join('')

  // Formata se necessário
  if (outputFormat.value === 'formatted') {
    return `${cnpj.slice(0, 2).join('')}.${cnpj.slice(2, 5).join('')}.${cnpj.slice(5, 8).join('')}/${cnpj.slice(8, 12).join('')}-${cnpj.slice(12).join('')}`
  }

  return cnpjUnformatted
}

// Função para validar CNPJ
const isValidCnpj = (cnpj) => {
  if (!cnpj) return false

  // exige formato válido completo
  const validPattern = /^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/

  if (!validPattern.test(cnpj)) return false

  const clean = cnpj.replace(/\D/g, '')

  if (/^(\d)\1+$/.test(clean)) return false

  const digits = clean.split('').map(Number)

  const base12 = digits.slice(0, 12)

  const [digit1, digit2] = calculateCheckDigits(base12)

  return digit1 === digits[12] && digit2 === digits[13]
}

// Computed para validação
const validationError = computed(() => {
  if (!cnpjToValidate.value.trim()) return ''

  // Valida caracteres permitidos
  if (!/^[\d.\/-]*$/.test(cnpjToValidate.value)) {
    return 'CNPJ contém caracteres inválidos. Use apenas dígitos, pontos, hífens e barra.'
  }

  const cleanCnpj = cnpjToValidate.value.replace(/\D/g, '')

  if (cleanCnpj.length !== 14) {
    return `CNPJ deve ter 14 dígitos (encontrados ${cleanCnpj.length})`
  }

  if (/^(\d)\1{13}$/.test(cleanCnpj)) {
    return 'CNPJ com todos os dígitos iguais é inválido'
  }

  return 'Os dígitos verificadores estão incorretos'
})

// Função para gerar CNPJs
const generateCnpjs = () => {
  generatedCnpjs.value = []
  const quantity = Math.min(quantityToGenerate.value, 100) // Limita a 100

  for (let i = 0; i < quantity; i++) {
    generatedCnpjs.value.push(generateValidCnpj())
  }

  if (quantity === 1) {
    notify.success('CNPJ gerado com sucesso!')
  } else {
    notify.success(`${quantity} CNPJs gerados com sucesso!`)
  }
}

// Função para copiar CNPJ individual
const copyCnpj = async (cnpj) => {
  await copy(cnpj)
  notify.success('CNPJ copiado!')
}

// Função para copiar todos os CNPJs
const copyAll = async () => {
  const text = generatedCnpjs.value.join('\n')
  await copy(text)
  notify.success('Todos os CNPJs copiados!')
}

// Função para limpar CNPJs
const clearCnpjs = () => {
  generatedCnpjs.value = []
  notify.success('Lista limpa!')
}

// Função para download CNPJ único
const downloadCnpj = () => {
  const cnpj = generatedCnpjs.value[0]
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(cnpj)}`
  )
  element.setAttribute('download', `cnpj-${Date.now()}.txt`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('CNPJ baixado!')
}

// Função para download múltiplos CNPJs
const downloadAll = () => {
  // Cria CSV
  const csv = 'CNPJ\n' + generatedCnpjs.value.join('\n')
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
  )
  element.setAttribute('download', `cnpjs-${Date.now()}.csv`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('CNPJs baixados como CSV!')
}
</script>

<style scoped></style>
