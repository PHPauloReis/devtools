<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Gerador de UUID</h1>
      <p class="text-gray-400 mb-8">Gere identificadores únicos universais (UUID v4)</p>

      <!-- Generation Options -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Versão UUID:
          </label>
          <select
            v-model="uuidVersion"
            class="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="v4">UUID v4 (Aleatório)</option>
            <option value="v1">UUID v1 (Timestamp)</option>
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
            @click="generateUuids"
            class="w-full btn-primary flex items-center justify-center gap-2"
          >
            🎲 Gerar UUID(s)
          </button>
        </div>
      </div>

      <!-- Generated UUIDs Section -->
      <div v-if="generatedUuids.length > 0" class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          UUID(s) Gerado(s) ({{ generatedUuids.length }}):
        </label>
        <div class="bg-dark-900 border border-dark-700 rounded-lg p-6">
          <!-- Single UUID Display -->
          <div v-if="generatedUuids.length === 1" class="text-center">
            <div class="bg-dark-800 rounded-lg p-6 mb-4">
              <p class="text-gray-400 text-sm mb-2">UUID Gerado:</p>
              <p class="text-2xl font-bold text-blue-400 font-mono tracking-wider break-all">
                {{ generatedUuids[0] }}
              </p>
            </div>

            <!-- Single UUID Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                @click="copyUuid(generatedUuids[0])"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                📋 Copiar
              </button>
              <button
                @click="generateUuids"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                🔄 Gerar Novo
              </button>
              <button
                @click="downloadUuid"
                class="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                💾 Download
              </button>
            </div>
          </div>

          <!-- Multiple UUIDs Display -->
          <div v-else>
            <div class="max-h-96 overflow-y-auto mb-4">
              <div
                v-for="(uuid, index) in generatedUuids"
                :key="index"
                class="flex items-center justify-between bg-dark-800 rounded-lg p-3 mb-2"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-gray-400 text-xs">UUID #{{ index + 1 }}</p>
                  <p class="text-blue-400 font-mono font-semibold break-all">{{ uuid }}</p>
                </div>
                <button
                  @click="copyUuid(uuid)"
                  class="ml-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex-shrink-0"
                >
                  📋
                </button>
              </div>
            </div>

            <!-- Multiple UUIDs Actions -->
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
                @click="clearUuids"
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
        <p class="text-gray-400 text-lg">🎲 Clique em "Gerar UUID(s)" para começar</p>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-dark-900 border border-dark-700 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-blue-400 mb-2">📝 UUID v4</h3>
          <p class="text-xs text-gray-400">
            Baseado em valores aleatórios. Mais comumente usado e oferece melhor performance.
          </p>
        </div>
        <div class="bg-dark-900 border border-dark-700 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-blue-400 mb-2">⏰ UUID v1</h3>
          <p class="text-xs text-gray-400">
            Baseado em timestamp. Contém informações de data/hora e identificador da máquina.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useClipboard } from '@/composables'

const generatedUuids = ref([])
const uuidVersion = ref('v4')
const quantityToGenerate = ref(1)
const { copy } = useClipboard()

/**
 * Generate UUID v4 (random)
 */
const generateUuidV4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate UUID v1 (timestamp-based)
 */
const generateUuidV1 = () => {
  let d = new Date().getTime()
  let d2 = (performance.now() * 1000) % 1000
  return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate UUID based on selected version
 */
const generateUuid = () => {
  return uuidVersion.value === 'v4' ? generateUuidV4() : generateUuidV1()
}

/**
 * Generate UUIDs
 */
const generateUuids = () => {
  const quantity = Math.min(quantityToGenerate.value, 100)
  generatedUuids.value = Array.from({ length: quantity }, () => generateUuid())
}

/**
 * Copy single UUID
 */
const copyUuid = (uuid) => {
  copy(uuid)
}

/**
 * Copy all UUIDs
 */
const copyAll = () => {
  const text = generatedUuids.value.join('\n')
  copy(text)
}

/**
 * Download single UUID as text file
 */
const downloadUuid = () => {
  const uuid = generatedUuids.value[0]
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(uuid))
  element.setAttribute('download', 'uuid.txt')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

/**
 * Download all UUIDs as CSV file
 */
const downloadAll = () => {
  const csv = generatedUuids.value.join('\n')
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
  element.setAttribute('download', `uuids-${new Date().getTime()}.csv`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

/**
 * Clear UUIDs
 */
const clearUuids = () => {
  generatedUuids.value = []
}
</script>
