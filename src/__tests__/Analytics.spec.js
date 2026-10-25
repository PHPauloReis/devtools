import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAnalytics } from '@/composables'

describe('useAnalytics', () => {
  beforeEach(() => {
    localStorage.clear()
    window.gtag = vi.fn()
  })

  it('sends events to Google Analytics after consent', () => {
    localStorage.setItem('devtools.analytics-consent', 'accepted')
    window.gtag = vi.fn()
    const { trackEvent } = useAnalytics()

    trackEvent('gerar_cpf', { quantidade: 2 })

    expect(window.gtag).toHaveBeenCalledWith('event', 'gerar_cpf', { quantidade: 2 })
  })

  it('does not send events before the visitor accepts', () => {
    const { trackEvent } = useAnalytics()

    trackEvent('gerar_cpf')

    expect(window.gtag).not.toHaveBeenCalled()
  })
})
