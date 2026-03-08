/* ============================================================================
   DevTools - Arquivo de Configurações Padrão
   ============================================================================ */

// Configurações gerais da aplicação
export const APP_CONFIG = {
  name: 'DevTools',
  version: '1.0.0',
  description: 'Sistema de ferramentas para desenvolvedores',
  author: 'DevTools Team',
}

// Configurações de cores (Dark Mode)
export const COLOR_PALETTE = {
  dark: {
    950: '#030712',
    900: '#111827',
    800: '#1f2937',
    700: '#374151',
    600: '#4b5563',
    500: '#6b7280',
    400: '#9ca3af',
  },
  primary: '#3b82f6',    // Blue-600
  secondary: '#6b7280',  // Gray-500
  success: '#10b981',    // Green-500
  warning: '#f59e0b',    // Amber-500
  danger: '#ef4444',     // Red-500
  info: '#06b6d4',       // Cyan-500
}

// Configurações de notificação
export const NOTIFICATION_CONFIG = {
  duration: 3000,        // 3 segundos
  position: 'top-right',
}

// Configurações de paginação
export const PAGINATION_CONFIG = {
  itemsPerPage: 10,
  maxPages: 5,
}

// Configurações de cache
export const CACHE_CONFIG = {
  enabled: true,
  maxAge: 1000 * 60 * 60, // 1 hora
}

// URLs base para APIs (se necessário no futuro)
export const API_ENDPOINTS = {
  baseUrl: process.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
}

// Mensagens padrão
export const MESSAGES = {
  success: 'Operação realizada com sucesso!',
  error: 'Ocorreu um erro. Tente novamente.',
  warning: 'Atenção: verifique as informações.',
  info: 'Informação importante.',
  notFound: 'Recurso não encontrado.',
  unauthorized: 'Você não tem permissão para acessar este recurso.',
  forbidden: 'Acesso proibido.',
  loading: 'Carregando...',
  empty: 'Nenhum item encontrado.',
}

export default {
  APP_CONFIG,
  COLOR_PALETTE,
  NOTIFICATION_CONFIG,
  PAGINATION_CONFIG,
  CACHE_CONFIG,
  API_ENDPOINTS,
  MESSAGES,
}
