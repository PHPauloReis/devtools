import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import CookieConsent from '../components/CookieConsent.vue'

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
    document.head.querySelector('script[data-ga4]')?.remove()
    delete window.gtag
    delete window.dataLayer
  })

  it('does not load GA4 before the visitor makes a choice', () => {
    const wrapper = mount(CookieConsent)

    expect(wrapper.text()).toContain('Aceitar analytics')
    expect(document.querySelector('script[data-ga4]')).toBeNull()
    expect(window.gtag).toBeUndefined()
  })

  it('saves acceptance and loads GA4 only after the visitor accepts', async () => {
    const wrapper = mount(CookieConsent)

    await wrapper.findAll('button')[1].trigger('click')

    expect(localStorage.getItem('devtools.analytics-consent')).toBe('accepted')
    expect(document.querySelector('script[data-ga4]').src).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-5Q6L8N060Q',
    )
    expect(window.dataLayer).toHaveLength(2)
    expect(window.dataLayer[1][0]).toBe('config')
    expect(window.dataLayer[1][1]).toBe('G-5Q6L8N060Q')
  })

  it('saves rejection without loading GA4', async () => {
    const wrapper = mount(CookieConsent)

    await wrapper.findAll('button')[0].trigger('click')

    expect(localStorage.getItem('devtools.analytics-consent')).toBe('rejected')
    expect(document.querySelector('script[data-ga4]')).toBeNull()
    expect(window.gtag).toBeUndefined()
  })

  it('keeps a previous rejection without loading GA4', async () => {
    localStorage.setItem('devtools.analytics-consent', 'rejected')
    const wrapper = mount(CookieConsent)

    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.querySelector('script[data-ga4]')).toBeNull()
  })

  it('loads GA4 on a later visit when acceptance was already saved', () => {
    localStorage.setItem('devtools.analytics-consent', 'accepted')

    mount(CookieConsent)

    expect(document.querySelector('script[data-ga4]')).not.toBeNull()
    expect(window.dataLayer[1][0]).toBe('config')
  })

  it('shows the banner if the saved consent value is invalid', () => {
    localStorage.setItem('devtools.analytics-consent', 'unknown')
    const wrapper = mount(CookieConsent)

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(document.querySelector('script[data-ga4]')).toBeNull()
  })
})
