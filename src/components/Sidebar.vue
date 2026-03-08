<template>
  <aside class="w-64 bg-dark-900 border-r border-dark-700 h-screen overflow-y-auto fixed left-0 top-0">
    <!-- Header -->
    <div class="p-6 border-b border-dark-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">⚙</span>
        </div>
        <h1 class="text-xl font-bold text-white">DevTools</h1>
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
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path
}
</script>

<style scoped></style>
