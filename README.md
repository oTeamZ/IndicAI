# 🏆 indicAI

<div align="center">
  <img src="https://placeholder.svg?height=120&width=120&query=indicAI+logo+with+oscar+statuette" alt="indicAI Logo" />
  
  **Descubra sua próxima obsessão cultural com um swipe**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
</div>

---

## 📖 Sobre o Projeto

**indicAI** é uma plataforma inovadora de recomendações inteligentes que combina algoritmos avançados com uma interface intuitiva para fornecer sugestões personalizadas. Através de um sistema de avaliação interativo, os usuários constroem seu perfil de preferências enquanto descobrem novos conteúdos que realmente combinam com seus gostos.

### 🎯 Problema que Resolve

- **Paralisia de escolha**: Com milhares de opções em streaming, escolher o que assistir/ler/ouvir se tornou estressante
- **Recomendações genéricas**: Algoritmos tradicionais não capturam nuances do gosto pessoal
- **Descoberta limitada**: Usuários ficam presos em bolhas de conteúdo similar

### 💡 Nossa Solução

indicAI transforma a descoberta de conteúdo em uma experiência inteligente e personalizada, coletando feedback instantâneo para criar um perfil de preferências cada vez mais preciso.

---

## ✨ Funcionalidades Principais

### 🃏 Sistema de Swipe Interativo
- **Swipe Right (→)**: Gostei - Adiciona à lista de favoritos
- **Swipe Left (←)**: Não gostei - Remove das recomendações
- **Swipe Up (↑)**: Super Like - Marca como altamente relevante
- **Skip (⏭️)**: Não conheço - Pula sem afetar recomendações

### 🎯 Recomendações Personalizadas
- Algoritmo baseado em perfil de gosto construído através das interações
- Categorização por tipo de mídia (Filmes, Séries, Livros, Música)
- Score de compatibilidade em tempo real
- Aprendizado contínuo com cada swipe

### 🌟 SuperStar (Trending)
- Conteúdo em alta no momento
- Filtros por categoria e período
- Integração com tendências globais
- Descoberta de novos lançamentos

### 👤 Perfil do Usuário
- Estatísticas detalhadas de uso
- Histórico de avaliações
- Listas personalizadas (Favoritos, Assistir Depois, Já Vi)
- Gráficos de preferências por gênero

### 🚀 Onboarding Inteligente
- Avaliação inicial de 10-15 títulos populares
- Construção rápida do perfil de gosto
- Skip opcional para usuários experientes

### 🎨 Interface Moderna
- Design responsivo (mobile-first)
- Animações fluidas e feedback tátil
- Tema escuro otimizado
- Cores vibrantes e gamificadas

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Estilização utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI reutilizáveis
- **[Framer Motion](https://www.framer.com/motion/)** - Animações e gestos
- **[Lucide Icons](https://lucide.dev/)** - Ícones modernos

### Bibliotecas Auxiliares
- **[use-gesture](https://use-gesture.netlify.app/)** - Detecção de gestos de swipe
- **[Recharts](https://recharts.org/)** - Gráficos e visualizações
- **[date-fns](https://date-fns.org/)** - Manipulação de datas

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão

---

## 📁 Estrutura do Projeto

\`\`\`
reelswipe/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raiz com providers
│   ├── page.tsx                 # Página principal
│   └── globals.css              # Estilos globais e design tokens
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── discover-tab.tsx         # Tab de descoberta com swipe
│   ├── media-card.tsx           # Card de mídia com animações
│   ├── recommendations-tab.tsx  # Tab de recomendações
│   ├── superstar-tab.tsx        # Tab de trending
│   ├── profile-tab.tsx          # Tab de perfil do usuário
│   ├── onboarding-modal.tsx     # Modal de onboarding
│   ├── stats-card.tsx           # Card de estatísticas
│   ├── media-list.tsx           # Lista de mídias
│   └── genre-chart.tsx          # Gráfico de gêneros
│
├── lib/                         # Utilitários e tipos
│   ├── types.ts                 # Definições TypeScript
│   ├── mock-data.ts             # Dados mockados para demo
│   ├── recommendations.ts       # Lógica de recomendações
│   └── utils.ts                 # Funções auxiliares
│
├── hooks/                       # Custom React Hooks
│   ├── use-mobile.tsx          # Detecção de mobile
│   └── use-toast.ts            # Sistema de notificações
│
├── public/                      # Assets estáticos
│   └── ...
│
├── README.md                    # Este arquivo
├── package.json                 # Dependências do projeto
├── tsconfig.json               # Configuração TypeScript
├── next.config.mjs             # Configuração Next.js
└── tailwind.config.ts          # Configuração Tailwind
\`\`\`

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- **Node.js** 18.x ou superior
- **npm**, **yarn**, **pnpm** ou **bun**
- **Git** (para clonar o repositório)

### Passo a Passo

1. **Clone o repositório**
   \`\`\`bash
   git clone https://github.com/seu-usuario/indicAI.git
   cd indicAI
   \`\`\`

2. **Instale as dependências**
   \`\`\`bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   \`\`\`

3. **Execute o servidor de desenvolvimento**
   \`\`\`bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   \`\`\`

4. **Acesse no navegador**
   \`\`\`
   http://localhost:3000
   \`\`\`

### Scripts Disponíveis

\`\`\`bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linting do código
\`\`\`

---

## 🏗️ Arquitetura do Sistema

### Fluxo de Dados

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Usuário Interage                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Componente de Swipe (UI)                    │
│  - Detecta gestos (drag, swipe)                         │
│  - Renderiza animações                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Estado Local (React State)                     │
│  - Histórico de swipes                                   │
│  - Perfil de gosto do usuário                           │
│  - Listas personalizadas                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│        Motor de Recomendações (lib/recommendations)     │
│  - Calcula score de compatibilidade                     │
│  - Filtra conteúdo baseado em preferências             │
│  - Ordena por relevância                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Renderização de Resultados                  │
│  - Próximo card a ser exibido                           │
│  - Atualização de estatísticas                          │
│  - Feedback visual                                       │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Componentes Principais

#### 1. **MediaCard** (`components/media-card.tsx`)
Componente central que renderiza cada card de mídia com:
- Detecção de gestos de arrasto
- Animações de swipe
- Indicadores visuais de ação
- Informações da mídia (título, ano, gênero, rating)

#### 2. **DiscoverTab** (`components/discover-tab.tsx`)
Gerencia a pilha de cards e lógica de swipe:
- Mantém fila de cards
- Processa ações do usuário
- Atualiza perfil de gosto
- Carrega novos cards

#### 3. **RecommendationsEngine** (`lib/recommendations.ts`)
Algoritmo de recomendação baseado em:
- Histórico de likes/dislikes
- Gêneros preferidos
- Ratings médios
- Popularidade do conteúdo

#### 4. **OnboardingModal** (`components/onboarding-modal.tsx`)
Coleta preferências iniciais:
- Apresenta títulos populares
- Constrói perfil inicial
- Permite skip para usuários experientes

---

## 🎨 Sistema de Design

### Paleta de Cores

\`\`\`css
/* Cores Primárias */
--primary: 330 80% 55%        /* Rosa vibrante */
--primary-foreground: 0 0% 100%

/* Cores de Acento */
--accent: 180 70% 50%         /* Teal/Cyan */
--accent-foreground: 0 0% 100%

/* Cores Neutras */
--background: 240 10% 8%      /* Preto suave */
--foreground: 0 0% 98%        /* Branco suave */
--card: 240 8% 12%
--muted: 240 6% 20%

/* Cores Semânticas */
--success: 142 76% 36%        /* Verde */
--destructive: 0 84% 60%      /* Vermelho */
\`\`\`

### Tipografia

- **Fonte Principal**: Geist Sans (headings e body)
- **Fonte Mono**: Geist Mono (código e dados técnicos)
- **Escala**: 12px, 14px, 16px, 18px, 24px, 32px, 48px

### Espaçamento

Baseado na escala do Tailwind (4px base):
- `gap-2` (8px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px)

---

## 🔮 Roadmap Futuro

### Fase 1 - MVP (Atual) ✅
- [x] Sistema de swipe básico
- [x] Recomendações baseadas em perfil
- [x] Interface responsiva
- [x] Onboarding inicial

### Fase 2 - Social (Q2 2025)
- [ ] Sistema de autenticação (Supabase Auth)
- [ ] Compartilhamento de listas
- [ ] Ver o que amigos estão curtindo
- [ ] Comentários e reviews

### Fase 3 - Inteligência (Q3 2025)
- [ ] Integração com APIs reais (TMDB, Spotify, Google Books)
- [ ] Machine Learning para recomendações
- [ ] Análise de sentimento em reviews
- [ ] Notificações de novos lançamentos

### Fase 4 - Monetização (Q4 2025)
- [ ] Plano Premium com recursos avançados
- [ ] Integração com serviços de streaming
- [ ] Programa de afiliados
- [ ] Analytics para criadores de conteúdo

---

## 🌐 Deploy em Produção

### Opção 1: Vercel (Recomendado)

\`\`\`bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça deploy
vercel
\`\`\`

### Opção 2: AWS Amplify

\`\`\`bash
# Instale a CLI do Amplify
npm install -g @aws-amplify/cli

# Configure
amplify init
amplify add hosting
amplify publish
\`\`\`

### Opção 3: Docker

\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

\`\`\`bash
# Build e run
docker build -t reelswipe .
docker run -p 3000:3000 reelswipe
\`\`\`

---

## 🧪 Testes

### Estrutura de Testes (Futuro)

\`\`\`bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
\`\`\`

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga estes passos:

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
   \`\`\`bash
   git checkout -b feature/MinhaNovaFeature
   \`\`\`
3. **Commit suas mudanças**
   \`\`\`bash
   git commit -m 'Adiciona MinhaNovaFeature'
   \`\`\`
4. **Push para a branch**
   \`\`\`bash
   git push origin feature/MinhaNovaFeature
   \`\`\`
5. **Abra um Pull Request**

### Diretrizes de Contribuição

- Siga o estilo de código existente
- Escreva mensagens de commit descritivas
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Seja respeitoso e construtivo nos code reviews

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Seu Nome** - *Desenvolvimento Inicial* - [@seu-usuario](https://github.com/seu-usuario)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) pela incrível framework
- [shadcn/ui](https://ui.shadcn.com/) pelos componentes lindos
- [Vercel](https://vercel.com/) pela plataforma de deploy
- Comunidade open-source por todas as bibliotecas utilizadas

---

## 📞 Contato

- **Website**: [indicai.com](https://indicai.com)
- **Email**: contato@indicai.com
- **Twitter**: [@indicai](https://twitter.com/indicai)
- **Discord**: [Comunidade indicAI](https://discord.gg/indicai)

---

<div align="center">
  Feito com ❤️ e muito ☕ por desenvolvedores que amam cultura pop
  
  **[⬆ Voltar ao topo](#-reelswipe)**
</div>
