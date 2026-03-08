import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Home from '@/views/Home.vue'
import ComingSoon from '@/views/ComingSoon.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          component: Home
        },
        // Text Tools
        {
          path: 'text-counter',
          component: ComingSoon
        },
        {
          path: 'word-counter',
          component: ComingSoon
        },
        {
          path: 'case-converter',
          component: ComingSoon
        },
        {
          path: 'text-case',
          component: ComingSoon
        },
        // Base64 Tools
        {
          path: 'base64-encode',
          component: ComingSoon
        },
        {
          path: 'base64-decode',
          component: ComingSoon
        },
        // Validation Tools
        {
          path: 'json-validator',
          component: ComingSoon
        },
        {
          path: 'json-formatter',
          component: ComingSoon
        },
        {
          path: 'xml-validator',
          component: ComingSoon
        },
        {
          path: 'xml-formatter',
          component: ComingSoon
        },
        {
          path: 'regex-tester',
          component: ComingSoon
        },
        // Document Tools
        {
          path: 'cpf-generator',
          component: ComingSoon
        },
        {
          path: 'cpf-validator',
          component: ComingSoon
        },
        {
          path: 'cnpj-generator',
          component: ComingSoon
        },
        {
          path: 'cnpj-validator',
          component: ComingSoon
        }
      ]
    }
  ]
})

export default router
