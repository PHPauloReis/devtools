import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Base64Decode from '../views/Base64Decode.vue'
import Base64Encode from '../views/Base64Encode.vue'
import CaseConverter from '../views/CaseConverter.vue'
import CnpjGenerator from '../views/CnpjGenerator.vue'
import JsonValidator from '../views/JsonValidator.vue'
import RegexTester from '../views/RegexTester.vue'
import StripTags from '../views/StripTags.vue'
import TextCase from '../views/TextCase.vue'
import TextCounter from '../views/TextCounter.vue'
import UuidGenerator from '../views/UuidGenerator.vue'
import WordCounter from '../views/WordCounter.vue'
import XmlValidator from '../views/XmlValidator.vue'
import BcryptGenerator from '../views/BcryptGenerator.vue'

const pasteCases = [
  [TextCounter, 'paste_contador_caracteres'],
  [WordCounter, 'paste_contar_palavras'],
  [CaseConverter, 'paste_conversor_case'],
  [TextCase, 'paste_maiuscula_minuscula'],
  [StripTags, 'paste_remover_tags_html_xml'],
  [Base64Encode, 'paste_codificar_base64'],
  [Base64Decode, 'paste_decodificar_base64'],
  [JsonValidator, 'paste_validar_json'],
  [XmlValidator, 'paste_validar_xml'],
]

describe('tool analytics events', () => {
  beforeEach(() => {
    window.gtag = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each(pasteCases)('tracks paste in %s', async (Component, eventName) => {
    const wrapper = mount(Component)

    await wrapper.find('textarea').trigger('paste')

    expect(window.gtag).toHaveBeenCalledWith('event', eventName, undefined)
  })

  it('tracks paste in the regex test text and expression fields separately', async () => {
    const wrapper = mount(RegexTester)
    const [expressionInput, testTextArea] = [
      wrapper.find('input[type="text"]'),
      wrapper.find('textarea'),
    ]

    await expressionInput.trigger('paste')
    await testTextArea.trigger('paste')

    expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'paste_regex_expressao', undefined)
    expect(window.gtag).toHaveBeenNthCalledWith(2, 'event', 'paste_regex_texto_teste', undefined)
  })

  it('tracks a regex after 250ms without sending the expression', async () => {
    vi.useFakeTimers()
    const wrapper = mount(RegexTester)
    const regexInput = wrapper.find('input[type="text"]')

    await regexInput.setValue('[a-z]+')
    vi.advanceTimersByTime(249)
    expect(window.gtag).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(window.gtag).toHaveBeenCalledWith('event', 'digitar_regex', undefined)
    expect(window.gtag.mock.calls.flat()).not.toContain('[a-z]+')
  })

  it('does not report a pasted regex again as typed input', async () => {
    vi.useFakeTimers()
    const wrapper = mount(RegexTester)
    const regexInput = wrapper.find('input[type="text"]')

    await regexInput.trigger('paste')
    await regexInput.setValue('[a-z]+')
    await regexInput.trigger('input', { inputType: 'insertFromPaste' })
    vi.advanceTimersByTime(250)

    expect(window.gtag).toHaveBeenCalledTimes(1)
    expect(window.gtag).toHaveBeenCalledWith('event', 'paste_regex_expressao', undefined)
  })

  it('tracks UUID generation', async () => {
    const wrapper = mount(UuidGenerator)
    const generateButton = wrapper.findAll('button').find(button => button.text().includes('Gerar UUID'))

    await generateButton.trigger('click')

    expect(window.gtag).toHaveBeenCalledWith('event', 'gerar_uuid', {
      quantidade: 1,
      versao: 'v4',
    })
  })

  it('tracks CNPJ generation and successful copy without sending the CNPJ', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    const wrapper = mount(CnpjGenerator)
    const generateButton = wrapper.findAll('button').find(button => button.text().includes('Gerar CNPJ'))

    await generateButton.trigger('click')
    expect(window.gtag).toHaveBeenCalledWith('event', 'gerar_cnpj', { quantidade: 1 })

    const copyButton = wrapper.findAll('button').find(button => button.text().includes('Copiar'))
    await copyButton.trigger('click')

    expect(window.gtag).toHaveBeenCalledWith('event', 'copiar_cnpj', { metodo: 'individual' })
    expect(window.gtag.mock.calls.flat()).not.toContain(navigator.clipboard.writeText.mock.calls[0][0])
  })

  it('tracks generating a BCrypt hash without sending the password', async () => {
    const wrapper = mount(BcryptGenerator)
    await wrapper.find('input[type="password"]').setValue('private-password')
    const generateButton = wrapper.findAll('button')
      .filter(button => button.text().includes('Gerar Hash'))
      .pop()

    await generateButton.trigger('click')

    expect(window.gtag).toHaveBeenCalledWith('event', 'gerar_hash_bcrypt', undefined)
    expect(window.gtag.mock.calls.flat()).not.toContain('private-password')
  })
})
