# DevTools 🛠️

Um conjunto completo de ferramentas para desenvolvedores, construído com Vue 3, Vite e Tailwind CSS.

## 🌟 Características

- **Interface Dark Mode**: Design moderno com paleta de cores escura
- **Menu Lateral Intuitivo**: Navegação fácil entre todas as ferramentas
- **Ferramentas Populares**: 
  - 🔤 Ferramentas de Texto
  - 🔐 Ferramentas Base64
  - ✓ Validadores & Formatadores
  - 🆔 Ferramentas de Documentos

## 🚀 Ferramentas Disponíveis

### 🔤 Ferramentas de Texto
- **Contar Caracteres** - Conte caracteres em seu texto
- **Contar Palavras** - Conte palavras, linhas e obtenha informações
- **Maiúscula/Minúscula** - Converta entre maiúscula e minúscula
- **Conversor de Case** - Converta para camelCase, snake_case, kebab-case, etc

### 🔐 Base64
- **Codificar Base64** - Codifique texto ou arquivos para Base64
- **Decodificar Base64** - Decodifique Base64 para texto ou arquivo

### ✓ Validadores & Formatadores
- **Validar JSON** - Valide a estrutura e sintaxe de JSON
- **Formatar JSON** - Formate e identar JSON
- **Validar XML** - Valide a estrutura de documentos XML
- **Formatar XML** - Formate e identar XML
- **Testador Regex** - Teste e valide expressões regulares

### 🆔 Ferramentas de Documentos (Brasil)
- **Gerar CPF** - Gere um número de CPF válido para testes
- **Validar CPF** - Valide se um CPF é válido
- **Gerar CNPJ** - Gere um número de CNPJ válido para testes
- **Validar CNPJ** - Valide se um CNPJ é válido

## 📋 Estrutura do Projeto

```
devtools/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   └── Sidebar.vue   # Menu lateral de navegação
│   ├── layouts/          # Layouts principais
│   │   └── AppLayout.vue # Layout master da aplicação
│   ├── views/            # Páginas da aplicação
│   │   ├── Home.vue      # Página inicial
│   │   └── ComingSoon.vue # Página placeholder
│   ├── router/           # Configuração de rotas
│   ├── App.vue           # Componente raiz
│   ├── main.js           # Ponto de entrada
│   └── style.css         # Estilos globais
├── index.html            # HTML principal
├── tailwind.config.js    # Configuração do Tailwind CSS
├── postcss.config.js     # Configuração do PostCSS
├── vite.config.js        # Configuração do Vite
└── package.json          # Dependências do projeto
```

## 🛠️ Stack Tecnológico

- **Vue 3** - Framework JavaScript progressivo
- **Vite** - Build tool moderno e rápido
- **Vue Router** - Roteamento para aplicações de página única
- **Pinia** - Gerenciamento de estado
- **Tailwind CSS** - Framework CSS utilitário
- **Vitest** - Framework de testes unitários

## 📦 Instalar Dependências

```sh
npm install
```

## 🚀 Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```sh
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## 🔨 Build para Produção

```sh
npm run build
```

Para pré-visualizar a build:

```sh
npm run preview
```

## 🧪 Testes

### Testes Unitários
```sh
npm run test:unit
```

### Testes E2E
```sh
npm run test:e2e:dev  # Modo desenvolvimento
npm run test:e2e      # Modo produção
```

## ✨ Linting e Formatação

```sh
npm run lint            # Executar linters
npm run format          # Formatar código com Prettier
```

## 📱 Design

### Paleta de Cores (Dark Mode)
- **Background Principal**: `#030712` (dark-950)
- **Background Secundário**: `#111827` (dark-900)
- **Background Terciário**: `#1f2937` (dark-800)
- **Border**: `#374151` (dark-700)
- **Acento Primário**: Blue-600
- **Text Primário**: White
- **Text Secundário**: Gray-400

### Breakpoints Responsivos
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Próximos Passos

1. Implementar cada ferramenta individual
2. Adicionar testes unitários e E2E
3. Adicionar funcionalidade de histórico
4. Implementar tema claro/escuro
5. Adicionar exportação de resultados
6. Implementar PWA (Progressive Web App)

## 📝 Notas de Desenvolvimento

- Todos os dados são processados localmente no navegador
- A aplicação é offline-first
- Sem armazenamento de dados no servidor
- Interface intuitiva e responsiva

## 👨‍💻 Desenvolvido com ❤️

DevTools - Ferramentas essenciais para desenvolvedores

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
