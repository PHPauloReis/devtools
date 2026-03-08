<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Card -->
    <div class="card">
      <h1 class="text-3xl font-bold text-white mb-2">Validador de XML</h1>
      <p class="text-gray-400 mb-8">Valide e formate XML com facilidade</p>

      <!-- Input Area -->
      <div class="mb-8">
        <label class="block text-sm font-semibold text-gray-300 mb-3">
          Cole ou digite seu XML:
        </label>
        <textarea
          v-model="inputXml"
          placeholder='<?xml version="1.0"?><root><item>valor</item></root>'
          class="w-full h-40 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
        ></textarea>
        <div class="text-right text-xs text-gray-400 mt-2">
          {{ inputXml.length }} caracteres
        </div>
      </div>

      <!-- Validation Status -->
      <div v-if="inputXml.trim()" class="mb-8">
        <div v-if="isValidXml" class="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
          <p class="text-sm text-green-400">
            ✅ <strong>XML válido!</strong>
          </p>
        </div>
        <div v-else class="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
          <p class="text-sm text-red-400">
            ❌ <strong>XML inválido!</strong>
          </p>
          <p class="text-xs text-red-400 mt-2">{{ xmlError }}</p>
        </div>
      </div>

      <!-- Output Section -->
      <div v-if="isValidXml && inputXml.trim()" class="mb-8">
        <!-- Tabs -->
        <div class="flex gap-2 mb-6 border-b border-dark-700">
          <button
            @click="outputTab = 'formatted'"
            :class="{
              'text-blue-400 border-b-2 border-blue-400': outputTab === 'formatted',
              'text-gray-400 hover:text-white': outputTab !== 'formatted',
            }"
            class="px-4 py-2 transition-colors"
          >
            📋 Formatado
          </button>
          <button
            @click="outputTab = 'minified'"
            :class="{
              'text-blue-400 border-b-2 border-blue-400': outputTab === 'minified',
              'text-gray-400 hover:text-white': outputTab !== 'minified',
            }"
            class="px-4 py-2 transition-colors"
          >
            📦 Minimizado
          </button>
          <button
            @click="outputTab = 'tree'"
            :class="{
              'text-blue-400 border-b-2 border-blue-400': outputTab === 'tree',
              'text-gray-400 hover:text-white': outputTab !== 'tree',
            }"
            class="px-4 py-2 transition-colors"
          >
            🌳 Estrutura
          </button>
        </div>

        <!-- Formatted Output -->
        <div v-show="outputTab === 'formatted'" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            XML Formatado:
          </label>
          <div class="bg-dark-900 border-2 border-green-600/30 rounded-lg p-6">
            <div class="bg-dark-800 rounded p-4 text-green-400 break-words min-h-20 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
              {{ formattedXml }}
            </div>
          </div>
        </div>

        <!-- Minified Output -->
        <div v-show="outputTab === 'minified'" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            XML Minimizado:
          </label>
          <div class="bg-dark-900 border-2 border-blue-600/30 rounded-lg p-6">
            <div class="bg-dark-800 rounded p-4 text-blue-400 break-words min-h-20 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
              {{ minifiedXml }}
            </div>
          </div>
        </div>

        <!-- Tree Structure -->
        <div v-show="outputTab === 'tree'" class="mb-8">
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Estrutura do XML:
          </label>
          <div class="bg-dark-900 border-2 border-purple-600/30 rounded-lg p-6">
            <div class="bg-dark-800 rounded p-4 text-purple-400 min-h-20 max-h-96 overflow-y-auto font-mono text-xs whitespace-pre-wrap">
              {{ xmlStructure }}
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Original</p>
            <p class="text-white font-semibold text-sm">{{ originalSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Formatado</p>
            <p class="text-green-400 font-semibold text-sm">{{ formattedSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Minimizado</p>
            <p class="text-blue-400 font-semibold text-sm">{{ minifiedSize }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Economia (Min)</p>
            <p class="text-yellow-400 font-semibold text-sm">{{ savings }}</p>
          </div>
        </div>

        <!-- Element Count -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Total de Elementos</p>
            <p class="text-cyan-400 font-semibold text-sm">{{ elementCount }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Profundidade Máxima</p>
            <p class="text-orange-400 font-semibold text-sm">{{ maxDepth }}</p>
          </div>
          <div class="bg-dark-900 rounded-lg p-3 border border-dark-700">
            <p class="text-gray-400 text-xs mb-1">Elemento Raiz</p>
            <p class="text-pink-400 font-semibold text-sm">{{ rootElement }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            @click="copyFormatted"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            📋 Copiar Formatado
          </button>
          <button
            @click="copyMinified"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            📦 Copiar Minimizado
          </button>
          <button
            @click="downloadXml"
            class="btn-primary flex items-center justify-center gap-2 text-sm"
          >
            💾 Download
          </button>
          <button
            @click="clearAll"
            class="btn-secondary flex items-center justify-center gap-2 text-sm"
          >
            🗑️ Limpar
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-dark-900 rounded-lg border border-dark-700">
        <p class="text-gray-400 text-lg">📝 Cole XML para validar e formatar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClipboard, useNotification } from '@/composables'

const inputXml = ref('')
const outputTab = ref('formatted')
const { copy } = useClipboard()
const { notify } = useNotification()

// Função para validar XML
const validateXml = (str) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(str, 'text/xml')
    
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      const error = xmlDoc.getElementsByTagName('parsererror')[0]
      return { valid: false, error: error.textContent }
    }
    
    return { valid: true, error: null }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

const isValidXml = computed(() => {
  if (!inputXml.value.trim()) return false
  const result = validateXml(inputXml.value)
  return result.valid
})

const xmlError = computed(() => {
  if (!inputXml.value.trim()) return ''
  const result = validateXml(inputXml.value)
  return result.error || ''
})

// Função para formatar XML
const formatXml = (xml) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml')
    
    return formatElement(xmlDoc.documentElement, 0)
  } catch {
    return ''
  }
}

const formatElement = (element, depth) => {
  const indent = '  '.repeat(depth)
  const nextIndent = '  '.repeat(depth + 1)
  
  let result = `${indent}<${element.tagName}`
  
  // Adicionar atributos
  if (element.attributes.length > 0) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i]
      result += ` ${attr.name}="${attr.value}"`
    }
  }
  
  const hasChildren = element.children.length > 0
  const hasText = element.textContent.trim().length > 0 && element.children.length === 0
  
  if (!hasChildren && !hasText) {
    result += ' />'
  } else if (hasChildren) {
    result += '>\n'
    for (let i = 0; i < element.children.length; i++) {
      result += formatElement(element.children[i], depth + 1)
    }
    result += `${indent}</${element.tagName}>\n`
  } else if (hasText) {
    result += `>${element.textContent.trim()}</${element.tagName}>\n`
  }
  
  return result
}

const formattedXml = computed(() => {
  if (!isValidXml.value) return ''
  return formatXml(inputXml.value).trim()
})

// Função para minimizar XML
const minifyXml = (xml) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml')
    return minifyElement(xmlDoc.documentElement)
  } catch {
    return ''
  }
}

const minifyElement = (element) => {
  let result = `<${element.tagName}`
  
  // Adicionar atributos
  if (element.attributes.length > 0) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i]
      result += ` ${attr.name}="${attr.value}"`
    }
  }
  
  const hasChildren = element.children.length > 0
  const hasText = element.textContent.trim().length > 0 && element.children.length === 0
  
  if (!hasChildren && !hasText) {
    result += '/>'
  } else if (hasChildren) {
    result += '>'
    for (let i = 0; i < element.children.length; i++) {
      result += minifyElement(element.children[i])
    }
    result += `</${element.tagName}>`
  } else if (hasText) {
    result += `>${element.textContent.trim()}</${element.tagName}>`
  }
  
  return result
}

const minifiedXml = computed(() => {
  if (!isValidXml.value) return ''
  return minifyXml(inputXml.value)
})

// Função para construir estrutura
const buildXmlStructure = (element, depth = 0) => {
  const indent = '  '.repeat(depth)
  const nextIndent = '  '.repeat(depth + 1)
  
  const attrs = element.attributes.length > 0 
    ? ` [${element.attributes.length} attr]` 
    : ''
  
  let result = `${indent}${element.tagName}${attrs}\n`
  
  if (element.children.length > 0) {
    for (let i = 0; i < element.children.length; i++) {
      result += buildXmlStructure(element.children[i], depth + 1)
    }
  } else if (element.textContent.trim().length > 0) {
    const text = element.textContent.trim()
    const preview = text.length > 50 ? text.substring(0, 50) + '...' : text
    result += `${nextIndent}"${preview}"\n`
  }
  
  return result
}

const xmlStructure = computed(() => {
  if (!isValidXml.value) return ''
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(inputXml.value, 'text/xml')
    return buildXmlStructure(xmlDoc.documentElement).trim()
  } catch {
    return ''
  }
})

// Contar elementos
const elementCount = computed(() => {
  if (!isValidXml.value) return 0
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(inputXml.value, 'text/xml')
    return xmlDoc.getElementsByTagName('*').length
  } catch {
    return 0
  }
})

// Profundidade máxima
const maxDepth = computed(() => {
  if (!isValidXml.value) return 0
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(inputXml.value, 'text/xml')
    
    const calculateDepth = (element) => {
      if (element.children.length === 0) return 1
      let max = 0
      for (let i = 0; i < element.children.length; i++) {
        const depth = calculateDepth(element.children[i])
        if (depth > max) max = depth
      }
      return max + 1
    }
    
    return calculateDepth(xmlDoc.documentElement)
  } catch {
    return 0
  }
})

// Elemento raiz
const rootElement = computed(() => {
  if (!isValidXml.value) return ''
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(inputXml.value, 'text/xml')
    return xmlDoc.documentElement.tagName
  } catch {
    return ''
  }
})

const originalSize = computed(() => {
  return formatBytes(new TextEncoder().encode(inputXml.value).length)
})

const formattedSize = computed(() => {
  return formatBytes(new TextEncoder().encode(formattedXml.value).length)
})

const minifiedSize = computed(() => {
  return formatBytes(new TextEncoder().encode(minifiedXml.value).length)
})

const savings = computed(() => {
  const original = new TextEncoder().encode(inputXml.value).length
  const minified = new TextEncoder().encode(minifiedXml.value).length
  
  if (original === 0) return '0%'
  
  const reduction = ((original - minified) / original) * 100
  return reduction.toFixed(1) + '%'
})

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const copyFormatted = async () => {
  await copy(formattedXml.value)
  notify.success('XML formatado copiado!')
}

const copyMinified = async () => {
  await copy(minifiedXml.value)
  notify.success('XML minimizado copiado!')
}

const downloadXml = () => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:application/xml;charset=utf-8,${encodeURIComponent(formattedXml.value)}`
  )
  element.setAttribute('download', `dados-${Date.now()}.xml`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  notify.success('Download iniciado!')
}

const clearAll = () => {
  inputXml.value = ''
  outputTab.value = 'formatted'
  notify.success('Limpo!')
}
</script>

<style scoped></style>
