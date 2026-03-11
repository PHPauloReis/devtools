import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Home from '@/views/Home.vue'
import TextCounter from '@/views/TextCounter.vue'
import WordCounter from '@/views/WordCounter.vue'
import CaseConverter from '@/views/CaseConverter.vue'
import TextCase from '@/views/TextCase.vue'
import Base64Encode from '@/views/Base64Encode.vue'
import Base64Decode from '@/views/Base64Decode.vue'
import JsonValidator from '@/views/JsonValidator.vue'
import XmlValidator from '@/views/XmlValidator.vue'
import RegexTester from '@/views/RegexTester.vue'
import CpfGenerator from '@/views/CpfGenerator.vue'
import CnpjGenerator from '@/views/CnpjGenerator.vue'
import StripTags from '@/views/StripTags.vue'
import DiffChecker from '@/views/DiffChecker.vue'
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
          component: TextCounter
        },
        {
          path: 'word-counter',
          component: WordCounter
        },
        {
          path: 'case-converter',
          component: CaseConverter
        },
        {
          path: 'text-case',
          component: TextCase
        },
        {
          path: 'strip-tags',
          component: StripTags
        },
        {
          path: 'diff-checker',
          component: DiffChecker
        },
        // Base64 Tools
        {
          path: 'base64-encode',
          component: Base64Encode
        },
        {
          path: 'base64-decode',
          component: Base64Decode
        },
        // Validation Tools
        {
          path: 'json-validator',
          component: JsonValidator
        },
        {
          path: 'json-formatter',
          component: ComingSoon
        },
        {
          path: 'xml-validator',
          component: XmlValidator
        },
        {
          path: 'xml-formatter',
          component: ComingSoon
        },
        {
          path: 'regex-tester',
          component: RegexTester
        },
        // Document Tools
        {
          path: 'cpf-generator',
          component: CpfGenerator
        },
        {
          path: 'cpf-validator',
          component: ComingSoon
        },
        {
          path: 'cnpj-generator',
          component: CnpjGenerator
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
