<script setup>
import { ref } from 'vue'
import bcrypt from 'bcryptjs'
import { useClipboard, useNotification } from '@/composables'

const { copy } = useClipboard()
const { notify } = useNotification()

// Tab control
const activeTab = ref('hash')

// --- Tab 1: Gerar Hash ---
const hashPassword = ref('')
const showHashPassword = ref(false)
const rounds = ref(10)
const generatedHash = ref('')
const hashTime = ref(null)
const isHashing = ref(false)

// --- Tab 2: Verificar Hash ---
const verifyPassword = ref('')
const showVerifyPassword = ref(false)
const hashToVerify = ref('')
const verifyResult = ref(null)
const verifyTime = ref(null)
const isVerifying = ref(false)

async function generateHash() {
  if (!hashPassword.value.trim()) {
    notify.error('Digite uma senha para gerar o hash')
    return
  }
  if (isHashing.value) return

  isHashing.value = true
  generatedHash.value = ''
  hashTime.value = null

  try {
    const start = performance.now()
    const hash = await bcrypt.hash(hashPassword.value, rounds.value)
    hashTime.value = Math.round(performance.now() - start)
    generatedHash.value = hash
    notify.success('Hash gerado com sucesso!')
  } catch (err) {
    notify.error('Erro ao gerar hash: ' + err.message)
  } finally {
    isHashing.value = false
  }
}

async function verifyHash() {
  if (!verifyPassword.value.trim()) {
    notify.error('Digite a senha para verificar')
    return
  }
  if (!hashToVerify.value.trim()) {
    notify.error('Cole o hash BCrypt para verificar')
    return
  }
  if (isVerifying.value) return

  isVerifying.value = true
  verifyResult.value = null
  verifyTime.value = null

  try {
    const start = performance.now()
    const result = await bcrypt.compare(verifyPassword.value, hashToVerify.value)
    verifyTime.value = Math.round(performance.now() - start)
    verifyResult.value = result
  } catch (err) {
    verifyResult.value = false
    verifyTime.value = 0
    notify.error('Hash inválido ou mal formatado')
  } finally {
    isVerifying.value = false
  }
}

async function copyHash() {
  if (generatedHash.value) await copy(generatedHash.value)
}

function clearHash() {
  hashPassword.value = ''
  generatedHash.value = ''
  hashTime.value = null
  showHashPassword.value = false
}

function clearVerify() {
  verifyPassword.value = ''
  hashToVerify.value = ''
  verifyResult.value = null
  verifyTime.value = null
  showVerifyPassword.value = false
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">BCrypt Generator</h1>
      <p class="text-gray-400 mb-8">
        Gere hashes BCrypt seguros e verifique senhas. Todo o processamento ocorre no seu navegador
        — nenhum dado é enviado para servidores.
      </p>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 border-b border-dark-700">
        <button
          @click="activeTab = 'hash'"
          :class="{
            'text-blue-400 border-b-2 border-blue-400': activeTab === 'hash',
            'text-gray-400 hover:text-white': activeTab !== 'hash',
          }"
          class="px-4 py-2 transition-colors font-medium"
        >
          🔐 Gerar Hash
        </button>
        <button
          @click="activeTab = 'verify'"
          :class="{
            'text-blue-400 border-b-2 border-blue-400': activeTab === 'verify',
            'text-gray-400 hover:text-white': activeTab !== 'verify',
          }"
          class="px-4 py-2 transition-colors font-medium"
        >
          ✅ Verificar Hash
        </button>
      </div>

      <!-- Tab 1: Gerar Hash -->
      <div v-show="activeTab === 'hash'">
        <!-- Senha -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-300 mb-2">Senha</label>
          <div class="relative">
            <input
              v-model="hashPassword"
              :type="showHashPassword ? 'text' : 'password'"
              placeholder="Digite a senha a ser hasheada..."
              class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 pr-12 text-white
                     placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              @keydown.enter="generateHash"
            />
            <button
              @click="showHashPassword = !showHashPassword"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-lg"
            >
              {{ showHashPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Rounds -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Rounds (custo):
            <span class="text-blue-400 font-mono ml-1">{{ rounds }}</span>
          </label>
          <input
            v-model.number="rounds"
            type="range"
            min="4"
            max="15"
            step="1"
            class="w-full accent-blue-500 cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>4 (mais rápido)</span>
            <span>15 (mais seguro)</span>
          </div>
          <p class="text-xs text-gray-400 mt-3 bg-dark-900 border border-dark-700 rounded-lg p-3">
            💡 Cada round duplica o tempo de processamento. Round 10 leva ~100ms. Valores mais altos
            aumentam a resistência contra ataques de força bruta, mas tornam o login mais lento.
            <span class="text-amber-400 font-medium">
              Rounds {{ rounds >= 13 ? '≥13' : '' }}
              {{ rounds >= 13 ? 'podem demorar vários segundos.' : '' }}
            </span>
          </p>
        </div>

        <!-- Botão gerar -->
        <button
          @click="generateHash"
          :disabled="isHashing"
          class="btn-primary flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isHashing">⏳ Gerando...</span>
          <span v-else>🔐 Gerar Hash</span>
        </button>

        <!-- Output -->
        <div v-if="generatedHash" class="mt-6">
          <label class="block text-sm font-semibold text-gray-300 mb-3">Hash Gerado</label>
          <div class="bg-dark-900 border border-green-600/30 rounded-lg p-4">
            <p class="text-green-400 font-mono text-sm break-all select-all leading-relaxed">
              {{ generatedHash }}
            </p>
          </div>
          <p v-if="hashTime !== null" class="text-xs text-gray-500 mt-2">
            ⏱ Gerado em {{ hashTime }}ms com {{ rounds }} rounds
          </p>
          <div class="flex flex-wrap gap-3 mt-4">
            <button
              @click="copyHash"
              class="btn-primary flex items-center gap-2 text-sm"
            >
              📋 Copiar Hash
            </button>
            <button
              @click="clearHash"
              class="btn-secondary flex items-center gap-2 text-sm"
            >
              🗑️ Limpar
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!isHashing" class="mt-6 text-center py-10 bg-dark-900 rounded-lg border border-dark-700">
          <p class="text-gray-500">Digite uma senha e clique em "Gerar Hash"</p>
        </div>
      </div>

      <!-- Tab 2: Verificar Hash -->
      <div v-show="activeTab === 'verify'">
        <!-- Senha -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-300 mb-2">Senha</label>
          <div class="relative">
            <input
              v-model="verifyPassword"
              :type="showVerifyPassword ? 'text' : 'password'"
              placeholder="Digite a senha a ser verificada..."
              class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 pr-12 text-white
                     placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              @click="showVerifyPassword = !showVerifyPassword"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-lg"
            >
              {{ showVerifyPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Hash -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-300 mb-2">Hash BCrypt</label>
          <textarea
            v-model="hashToVerify"
            rows="3"
            placeholder="Cole o hash BCrypt aqui... (ex: $2b$10$...)"
            class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white font-mono text-sm
                   placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        <!-- Botão verificar -->
        <button
          @click="verifyHash"
          :disabled="isVerifying"
          class="btn-primary flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isVerifying">⏳ Verificando...</span>
          <span v-else>✅ Verificar Hash</span>
        </button>

        <!-- Resultado -->
        <div v-if="verifyResult !== null" class="mt-6">
          <!-- Sucesso -->
          <div
            v-if="verifyResult"
            class="bg-green-600/10 border border-green-600/20 rounded-lg p-6 flex items-center gap-4"
          >
            <span class="text-4xl flex-shrink-0">✅</span>
            <div>
              <p class="text-green-400 font-semibold text-lg">Hash válido!</p>
              <p class="text-gray-300 text-sm mt-1">A senha corresponde ao hash fornecido.</p>
            </div>
          </div>
          <!-- Falha -->
          <div
            v-else
            class="bg-red-600/10 border border-red-600/20 rounded-lg p-6 flex items-center gap-4"
          >
            <span class="text-4xl flex-shrink-0">❌</span>
            <div>
              <p class="text-red-400 font-semibold text-lg">Hash inválido!</p>
              <p class="text-gray-300 text-sm mt-1">
                A senha não corresponde ao hash fornecido, ou o hash está mal formatado.
              </p>
            </div>
          </div>
          <p v-if="verifyTime !== null" class="text-xs text-gray-500 mt-2">
            ⏱ Verificado em {{ verifyTime }}ms
          </p>
          <button
            @click="clearVerify"
            class="btn-secondary flex items-center gap-2 text-sm mt-4"
          >
            🗑️ Limpar
          </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!isVerifying" class="mt-6 text-center py-10 bg-dark-900 rounded-lg border border-dark-700">
          <p class="text-gray-500">Informe a senha e o hash para verificar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
