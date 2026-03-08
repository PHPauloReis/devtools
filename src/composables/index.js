import { ref } from 'vue'

/**
 * Composable para notificações
 */
export const useNotification = () => {
  const notifications = ref([])

  const notify = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const notification = { id, message, type }
    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    notify: {
      success: (msg) => notify(msg, 'success'),
      error: (msg) => notify(msg, 'error'),
      warning: (msg) => notify(msg, 'warning'),
      info: (msg) => notify(msg, 'info'),
    },
    removeNotification,
  }
}

/**
 * Composable para carregamento
 */
export const useLoading = () => {
  const isLoading = ref(false)
  const error = ref(null)

  const execute = async (fn) => {
    isLoading.value = true
    error.value = null

    try {
      return await fn()
    } catch (e) {
      error.value = e.message || 'Erro ao executar operação'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    execute,
  }
}

/**
 * Composable para clipboard
 */
export const useClipboard = () => {
  const { notify } = useNotification()

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      notify.success('Copiado para clipboard!')
      return true
    } catch (err) {
      notify.error('Erro ao copiar para clipboard')
      return false
    }
  }

  const paste = async () => {
    try {
      return await navigator.clipboard.readText()
    } catch (err) {
      notify.error('Erro ao colar do clipboard')
      return null
    }
  }

  return {
    copy,
    paste,
  }
}

/**
 * Composable para download de arquivo
 */
export const useDownload = () => {
  const { notify } = useNotification()

  const download = (content, filename, type = 'text/plain') => {
    try {
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        `data:${type};charset=utf-8,${encodeURIComponent(content)}`
      )
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      notify.success('Download iniciado!')
    } catch (err) {
      notify.error('Erro ao fazer download')
    }
  }

  return {
    download,
  }
}

/**
 * Composable para upload de arquivo
 */
export const useFileUpload = () => {
  const { notify } = useNotification()

  const readFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => {
        notify.error('Erro ao ler arquivo')
        reject(new Error('Erro ao ler arquivo'))
      }
      reader.readAsText(file)
    })
  }

  const readFileAsBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => {
        notify.error('Erro ao ler arquivo')
        reject(new Error('Erro ao ler arquivo'))
      }
      reader.readAsDataURL(file)
    })
  }

  return {
    readFile,
    readFileAsBase64,
  }
}

/**
 * Composable para debounce
 */
export const useDebounce = () => {
  const debounce = (fn, delay = 500) => {
    let timeoutId

    return function debounced(...args) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), delay)
    }
  }

  return {
    debounce,
  }
}

/**
 * Composable para localStorage
 */
export const useLocalStorage = () => {
  const get = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      console.error(`Erro ao obter do localStorage:`, e)
      return defaultValue
    }
  }

  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(`Erro ao salvar no localStorage:`, e)
    }
  }

  const remove = (key) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error(`Erro ao remover do localStorage:`, e)
    }
  }

  const clear = () => {
    try {
      localStorage.clear()
    } catch (e) {
      console.error(`Erro ao limpar localStorage:`, e)
    }
  }

  return {
    get,
    set,
    remove,
    clear,
  }
}

export default {
  useNotification,
  useLoading,
  useClipboard,
  useDownload,
  useFileUpload,
  useDebounce,
  useLocalStorage,
}
