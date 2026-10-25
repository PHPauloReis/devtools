import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { useAnalytics, useClipboard, useNotification } from '@/composables'
import CpfGenerator from '../views/CpfGenerator.vue'

vi.mock('@/composables', () => ({
  useAnalytics: vi.fn(() => ({
    trackEvent: (...args) => window.gtag(...['event', ...args]),
  })),
  useClipboard: vi.fn(),
  useNotification: vi.fn(),
}))

describe('CpfGenerator analytics', () => {
  const copy = vi.fn()
  const notify = { success: vi.fn() }

  beforeEach(() => {
    copy.mockReset().mockResolvedValue(true)
    notify.success.mockReset()
    useClipboard.mockReturnValue({ copy })
    useNotification.mockReturnValue({ notify })
    window.gtag = vi.fn()
  })

  it('tracks CPF generation with the generated quantity', async () => {
    const wrapper = mount(CpfGenerator)
    await wrapper.find('button').trigger('click')

    expect(window.gtag).toHaveBeenCalledWith('event', 'gerar_cpf', { quantidade: 1 })
  })

  it('tracks successful individual CPF copies without sending the CPF', async () => {
    const wrapper = mount(CpfGenerator)
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('button')[1].trigger('click')

    expect(window.gtag).toHaveBeenCalledWith('event', 'copiar_cpf', { metodo: 'individual' })
    expect(window.gtag.mock.calls.flat()).not.toContain(copy.mock.calls[0][0])
  })

  it('tracks copying all CPFs as a separate copy method', async () => {
    const wrapper = mount(CpfGenerator)
    await wrapper.find('input[type="number"]').setValue(2)
    await wrapper.find('button').trigger('click')
    const copyAllButton = wrapper.findAll('button').find(button => button.text().includes('Copiar Todos'))
    await copyAllButton.trigger('click')

    expect(window.gtag).toHaveBeenCalledWith('event', 'copiar_cpf', { metodo: 'todos' })
    expect(window.gtag.mock.calls.flat()).not.toContain(copy.mock.calls[0][0])
  })

  it('does not track or report a successful copy when copying fails', async () => {
    copy.mockResolvedValue(false)
    const wrapper = mount(CpfGenerator)
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('button')[1].trigger('click')

    expect(window.gtag).not.toHaveBeenCalledWith('event', 'copiar_cpf', expect.anything())
    expect(notify.success).not.toHaveBeenCalledWith('CPF copiado!')
  })
})
