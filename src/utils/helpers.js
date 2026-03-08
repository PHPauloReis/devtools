/**
 * Utilitários para conversão de strings e casos
 */

// Converte string para camelCase
export const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

// Converte string para snake_case
export const toSnakeCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s_-]+/g, '_')
    .toLowerCase()
    .replace(/^_+|_+$/g, '')
}

// Converte string para kebab-case
export const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_-]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
}

// Converte string para PascalCase
export const toPascalCase = (str) => {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

// Converte string para UPPER_SNAKE_CASE
export const toUpperSnakeCase = (str) => {
  return toSnakeCase(str).toUpperCase()
}

// Converte string para Título
export const toTitleCase = (str) => {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Copia texto para clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err)
    return false
  }
}

// Faz download de arquivo
export const downloadFile = (content, filename, type = 'text/plain') => {
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
}

// Lê arquivo como texto
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// Lê arquivo como Base64
export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Utilitários para validação
 */

// Valida JSON
export const isValidJSON = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

// Formata JSON com indentação
export const formatJSON = (str, indent = 2) => {
  try {
    const parsed = JSON.parse(str)
    return JSON.stringify(parsed, null, indent)
  } catch (e) {
    throw new Error('JSON inválido')
  }
}

// Valida XML básico
export const isValidXML = (str) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(str, 'text/xml')
    return !xmlDoc.getElementsByTagName('parsererror').length
  } catch (e) {
    return false
  }
}

// Valida CPF (Brasil)
export const isValidCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '')

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.substring(10, 11))) return false

  return true
}

// Valida CNPJ (Brasil)
export const isValidCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/\D/g, '')

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false
  }

  let size = cnpj.length - 2
  let numbers = cnpj.substring(0, size)
  const digits = cnpj.substring(size)

  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  size = size + 1
  numbers = cnpj.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

// Valida email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Valida URL
export const isValidURL = (url) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Utilitários de string
 */

// Conta caracteres
export const countCharacters = (str) => {
  return {
    total: str.length,
    withoutSpaces: str.replace(/\s/g, '').length,
    letters: (str.match(/[a-zA-Z]/g) || []).length,
    numbers: (str.match(/\d/g) || []).length,
    spaces: (str.match(/\s/g) || []).length,
    special: str.replace(/[a-zA-Z0-9\s]/g, '').length,
  }
}

// Conta palavras
export const countWords = (str) => {
  const trimmed = str.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

// Conta linhas
export const countLines = (str) => {
  if (!str) return 0
  return str.split('\n').length
}

export default {
  // Conversão de case
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toPascalCase,
  toUpperSnakeCase,
  toTitleCase,

  // Arquivo
  copyToClipboard,
  downloadFile,
  readFileAsText,
  readFileAsBase64,

  // Validação
  isValidJSON,
  formatJSON,
  isValidXML,
  isValidCPF,
  isValidCNPJ,
  isValidEmail,
  isValidURL,

  // String
  countCharacters,
  countWords,
  countLines,
}
