<template>
  <aside
    class="w-64 bg-dark-900 border-r border-dark-700 h-screen overflow-y-auto fixed left-0 top-0 z-40 transition-transform duration-300 md:translate-x-0"
    :class="{ '-translate-x-full': !uiStore.sidebarOpen }"
  >
    <!-- Header -->
    <div class="p-4 md:p-6 border-b border-dark-700">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">⚙</span>
          </div>
          <h1 class="text-lg md:text-xl font-bold text-white">DevTools</h1>
        </div>
        <!-- Close button for mobile -->
        <button
          @click="uiStore.closeSidebar"
          class="md:hidden p-2 hover:bg-dark-800 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="p-4">
      <!-- Text Tools -->
      <div class="mb-2">
        <h3 class="text-xs uppercase tracking-widest text-gray-500 px-4 py-2 font-semibold">
          Ferramentas de Texto
        </h3>
        <RouterLink
          to="/text-counter"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/text-counter') }]"
        >
          <span class="text-lg mr-3">📊</span>
          <span>Contar Caracteres</span>
        </RouterLink>
        <RouterLink
          to="/word-counter"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/word-counter') }]"
        >
          <span class="text-lg mr-3">📝</span>
          <span>Contar Palavras</span>
        </RouterLink>
        <RouterLink
          to="/case-converter"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/case-converter') }]"
        >
          <span class="text-lg mr-3">🔄</span>
          <span>Conversor de Case</span>
        </RouterLink>
        <RouterLink
          to="/text-case"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/text-case') }]"
        >
          <span class="text-lg mr-3">Aa</span>
          <span>Maiúscula/Minúscula</span>
        </RouterLink>
        <RouterLink
          to="/strip-tags"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/strip-tags') }]"
        >
          <span class="text-lg mr-3">🧹</span>
          <span>Remover Tags</span>
        </RouterLink>
        <RouterLink
          to="/diff-checker"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/diff-checker') }]"
        >
          <span class="text-lg mr-3">📊</span>
          <span>Diff Checker</span>
        </RouterLink>
      </div>

      <!-- Base64 Tools -->
      <div class="mb-2">
        <h3 class="text-xs uppercase tracking-widest text-gray-500 px-4 py-2 font-semibold">
          Base64
        </h3>
        <RouterLink
          to="/base64-encode"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/base64-encode') }]"
        >
          <span class="text-lg mr-3">🔐</span>
          <span>Codificar Base64</span>
        </RouterLink>
        <RouterLink
          to="/base64-decode"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/base64-decode') }]"
        >
          <span class="text-lg mr-3">🔓</span>
          <span>Decodificar Base64</span>
        </RouterLink>
      </div>

      <!-- Validation Tools -->
      <div class="mb-2">
        <h3 class="text-xs uppercase tracking-widest text-gray-500 px-4 py-2 font-semibold">
          Validadores
        </h3>
        <RouterLink
          to="/json-validator"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/json-validator') }]"
        >
          <span class="text-lg mr-3">{ }</span>
          <span>Validar JSON</span>
        </RouterLink>
        <RouterLink
          to="/xml-validator"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/xml-validator') }]"
        >
          <span class="text-lg mr-3">◇</span>
          <span>Validar XML</span>
        </RouterLink>
        <RouterLink
          to="/regex-tester"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/regex-tester') }]"
        >
          <span class="text-lg mr-3">🔍</span>
          <span>Testador Regex</span>
        </RouterLink>
      </div>

      <!-- CPF/CNPJ Tools -->
      <div class="mb-2">
        <h3 class="text-xs uppercase tracking-widest text-gray-500 px-4 py-2 font-semibold">
          Documentos
        </h3>
        <RouterLink
          to="/cpf-generator"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/cpf-generator') }]"
        >
          <span class="text-lg mr-3">🆔</span>
          <span>Gerar CPF</span>
        </RouterLink>
        <RouterLink
          to="/cnpj-generator"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/cnpj-generator') }]"
        >
          <span class="text-lg mr-3">🏢</span>
          <span>Gerar CNPJ</span>
        </RouterLink>
      </div>

      <!-- Home -->
      <div class="mb-2">
        <RouterLink
          to="/"
          :class="['sidebar-item', { 'sidebar-item-active': isActive('/') }]"
        >
          <span class="text-lg mr-3">🏠</span>
          <span>Início</span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/ui'

const route = useRoute()
const uiStore = useUIStore()

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path
}

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  uiStore.closeSidebar()
})
</script>

<style scoped></style>
