import { describe, expect, it, vi } from 'vitest'

import { useAnalytics } from '@/composables'

describe('useAnalytics', () => {
  it('sends events to Google Analytics when gtag is available', () => {
    window.gtag = vi.fn()
    const { trackEvent } = useAnalytics()

    trackEvent('gerar_cpf', { quantidade: 2 })

    expect(window.gtag).toHaveBeenCalledWith('event', 'gerar_cpf', { quantidade: 2 })
  })

  it('does nothing when gtag is unavailable', () => {
    delete window.gtag
    const { trackEvent } = useAnalytics()

    expect(() => trackEvent('gerar_cpf')).not.toThrow()
  })
})
