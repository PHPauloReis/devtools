<script setup>
import { onMounted, ref } from 'vue'
import {
  getAnalyticsConsent,
  initializeAnalytics,
  setAnalyticsConsent,
} from '@/composables'

const consent = ref(getAnalyticsConsent())

onMounted(() => {
  initializeAnalytics()
})

const chooseConsent = (choice) => {
  setAnalyticsConsent(choice)
  consent.value = choice
}
</script>

<template>
  <aside
    v-if="consent === null"
    class="fixed inset-x-0 bottom-0 z-50 border-t border-dark-700 bg-dark-900/95 p-4 shadow-2xl backdrop-blur md:p-6"
    role="dialog"
    aria-labelledby="cookie-consent-title"
    aria-describedby="cookie-consent-description"
  >
    <div class="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="max-w-3xl">
        <h2 id="cookie-consent-title" class="text-lg font-semibold text-white">
          Sua privacidade importa
        </h2>
        <p id="cookie-consent-description" class="mt-1 text-sm text-gray-300">
          Utilizamos o Google Analytics para entender como os usuários utilizam esta ferramenta e
          identificar oportunidades de melhoria. Não armazenamos os textos, senhas ou outros
          conteúdos que você insere aqui. O Google Analytics só é ativado se você aceitar.
        </p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          class="btn-secondary whitespace-nowrap"
          @click="chooseConsent('rejected')"
        >
          Recusar analytics
        </button>
        <button
          type="button"
          class="btn-primary whitespace-nowrap"
          @click="chooseConsent('accepted')"
        >
          Aceitar analytics
        </button>
      </div>
    </div>
  </aside>
</template>
