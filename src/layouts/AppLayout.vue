<template>
  <div class="flex h-screen bg-dark-950">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 md:ml-64 overflow-auto">
      <!-- Header -->
      <header class="bg-dark-800 border-b border-dark-700 sticky top-0 z-20">
        <div class="px-4 md:px-8 py-4 flex items-center justify-between">
          <!-- Mobile Menu Button -->
          <button
            @click="uiStore.toggleSidebar"
            class="md:hidden p-2 hover:bg-dark-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <div class="flex-1 md:flex-none">
            <h2 class="text-lg md:text-2xl font-bold text-white">{{ pageTitle }}</h2>
            <p class="text-gray-400 text-xs md:text-sm mt-1">{{ pageDescription }}</p>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 md:p-8">
        <RouterView />
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="uiStore.sidebarOpen"
      @click="uiStore.closeSidebar"
      class="fixed inset-0 bg-black/50 md:hidden z-30"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import Sidebar from '@/components/Sidebar.vue'

const uiStore = useUIStore()

const route = useRoute()
const pageTitle = ref('DevTools')
const pageDescription = ref('Sistema de ferramentas para desenvolvedor')

const updatePageInfo = () => {
  const titles = {
    '/': { title: 'Início', desc: 'Bem-vindo ao DevTools' },
    '/text-counter': { title: 'Contar Caracteres', desc: 'Conte caracteres em seu texto' },
    '/word-counter': { title: 'Contar Palavras', desc: 'Conte palavras em seu texto' },
    '/case-converter': { title: 'Conversor de Case', desc: 'Converta entre diferentes tipos de case' },
    '/text-case': { title: 'Maiúscula/Minúscula', desc: 'Converta texto entre maiúscula e minúscula' },
    '/base64-encode': { title: 'Codificar Base64', desc: 'Codifique texto para Base64' },
    '/base64-decode': { title: 'Decodificar Base64', desc: 'Decodifique texto de Base64' },
    '/json-validator': { title: 'Validar JSON', desc: 'Valide a estrutura de JSON' },
    '/json-formatter': { title: 'Formatar JSON', desc: 'Formate e identar JSON' },
    '/xml-validator': { title: 'Validar XML', desc: 'Valide a estrutura de XML' },
    '/xml-formatter': { title: 'Formatar XML', desc: 'Formate e identar XML' },
    '/regex-tester': { title: 'Testador Regex', desc: 'Teste padrões de expressões regulares' },
    '/cpf-generator': { title: 'Gerar CPF', desc: 'Gere um CPF válido' },
    '/cpf-validator': { title: 'Validar CPF', desc: 'Valide um número de CPF' },
    '/cnpj-generator': { title: 'Gerar CNPJ', desc: 'Gere um CNPJ válido' },
    '/cnpj-validator': { title: 'Validar CNPJ', desc: 'Valide um número de CNPJ' },
  }

  const info = titles[route.path] || titles['/']
  pageTitle.value = info.title
  pageDescription.value = info.desc
}

watch(() => route.path, updatePageInfo, { immediate: true })
</script>

<style scoped></style>
