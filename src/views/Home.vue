<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- Welcome Section -->
    <div class="mb-8 md:mb-12">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">Bem-vindo ao DevTools</h1>
      <p class="text-base md:text-lg text-gray-400 mb-6 md:mb-8">
        Um conjunto completo de ferramentas para desenvolvedores. Escolha uma ferramenta abaixo para começar.
      </p>

      <!-- Quick Access Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-12">
        <!-- Text Tools Section -->
        <div class="col-span-full">
          <h2 class="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">🔤 Ferramentas de Texto</h2>
        </div>

        <RouterLink
          to="/text-counter"
          class="card group hover:shadow-lg hover:shadow-blue-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">📊</span>
            <span class="inline-block bg-blue-600/20 text-blue-400 px-2 md:px-3 py-1 rounded text-xs font-semibold">
              Popular
            </span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            Contar Caracteres
          </h3>
          <p class="text-gray-400 text-sm">
            Conte o número de caracteres no seu texto
          </p>
        </RouterLink>

        <RouterLink
          to="/word-counter"
          class="card group hover:shadow-lg hover:shadow-blue-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">📝</span>
            <span class="inline-block bg-green-600/20 text-green-400 px-2 md:px-3 py-1 rounded text-xs font-semibold">
              Popular
            </span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
            Contar Palavras
          </h3>
          <p class="text-gray-400 text-sm">
            Conte palavras, linhas e obtenha informações do texto
          </p>
        </RouterLink>

        <RouterLink
          to="/text-case"
          class="card group hover:shadow-lg hover:shadow-purple-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">Aa</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            Maiúscula/Minúscula
          </h3>
          <p class="text-gray-400 text-sm">
            Converta texto entre maiúscula e minúscula
          </p>
        </RouterLink>

        <RouterLink
          to="/case-converter"
          class="card group hover:shadow-lg hover:shadow-cyan-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🔄</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            Conversor de Case
          </h3>
          <p class="text-gray-400 text-sm">
            Converta para camelCase, snake_case, kebab-case, etc
          </p>
        </RouterLink>

        <RouterLink
          to="/strip-tags"
          class="card group hover:shadow-lg hover:shadow-orange-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🧹</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
            Remover Tags
          </h3>
          <p class="text-gray-400 text-sm">
            Remova tags HTML, XML e outras marcações
          </p>
        </RouterLink>

        <!-- Base64 Tools Section -->
        <div class="col-span-full mt-6 md:mt-8">
          <h2 class="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">🔐 Ferramentas Base64</h2>
        </div>

        <RouterLink
          to="/base64-encode"
          class="card group hover:shadow-lg hover:shadow-blue-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🔒</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            Codificar Base64
          </h3>
          <p class="text-gray-400 text-sm">
            Codifique texto ou arquivos para Base64
          </p>
        </RouterLink>

        <RouterLink
          to="/base64-decode"
          class="card group hover:shadow-lg hover:shadow-green-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🔓</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
            Decodificar Base64
          </h3>
          <p class="text-gray-400 text-sm">
            Decodifique Base64 para texto ou arquivo
          </p>
        </RouterLink>

        <!-- Validation Tools Section -->
        <div class="col-span-full mt-6 md:mt-8">
          <h2 class="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">✓ Validadores & Formatadores</h2>
        </div>

        <RouterLink
          to="/json-validator"
          class="card group hover:shadow-lg hover:shadow-yellow-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">{ }</span>
            <span class="inline-block bg-yellow-600/20 text-yellow-400 px-2 md:px-3 py-1 rounded text-xs font-semibold">
              Popular
            </span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
            Validar JSON
          </h3>
          <p class="text-gray-400 text-sm">
            Valide a estrutura e sintaxe de JSON
          </p>
        </RouterLink>

        <RouterLink
          to="/xml-validator"
          class="card group hover:shadow-lg hover:shadow-red-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">◇</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
            Validar XML
          </h3>
          <p class="text-gray-400 text-sm">
            Valide a estrutura de documentos XML
          </p>
        </RouterLink>

        <RouterLink
          to="/regex-tester"
          class="card group hover:shadow-lg hover:shadow-orange-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🔍</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
            Testador Regex
          </h3>
          <p class="text-gray-400 text-sm">
            Teste e valide expressões regulares
          </p>
        </RouterLink>

        <RouterLink
          to="/bcrypt-generator"
          class="card group hover:shadow-lg hover:shadow-indigo-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🛡️</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
            BCrypt
          </h3>
          <p class="text-gray-400 text-sm">
            Criptografe e valide senhas com BCrypt
          </p>
        </RouterLink>

        <RouterLink
          to="/uuid-generator"
          class="card group hover:shadow-lg hover:shadow-cyan-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🆔</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            Gerador UUID
          </h3>
          <p class="text-gray-400 text-sm">
            Gere identificadores únicos universais
          </p>
        </RouterLink>

        <!-- Document Tools Section -->
        <div class="col-span-full mt-6 md:mt-8">
          <h2 class="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">🆔 Ferramentas de Documentos</h2>
        </div>

        <RouterLink
          to="/cpf-generator"
          class="card group hover:shadow-lg hover:shadow-green-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🆔</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
            Gerar CPF
          </h3>
          <p class="text-gray-400 text-sm">
            Gere um número de CPF válido para testes
          </p>
        </RouterLink>

        <RouterLink
          to="/cnpj-generator"
          class="card group hover:shadow-lg hover:shadow-blue-600/20"
        >
          <div class="flex items-start justify-between mb-3 md:mb-4">
            <span class="text-3xl md:text-4xl">🏢</span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            Gerar CNPJ
          </h3>
          <p class="text-gray-400 text-sm">
            Gere um número de CNPJ válido para testes
          </p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped></style>
