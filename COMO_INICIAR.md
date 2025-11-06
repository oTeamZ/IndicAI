# 🚀 Como Iniciar o IndicAI com TMDB e Gemini Localmente

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Iniciar o Frontend IndicAI](#iniciar-o-frontend-indicai)
3. [Configuração Necessária](#configuração-necessária)
4. [Chaves de API](#chaves-de-api)
5. [Verificação Rápida](#verificação-rápida)
6. [Solução de Problemas](#solução-de-problemas-comuns)
7. [Comandos Úteis](#comandos-úteis)

## Visão Geral

Este guia explica como iniciar o IndicAI, que agora utiliza:
- **API do TMDB** para conteúdo de filmes e séries
- **IA do Gemini** para recomendações personalizadas baseadas no perfil do usuário
- **Sistema de aprendizado contínuo** que melhora com cada interação do usuário

## Iniciar o Frontend IndicAI

1. **Navegue até o diretório principal**:
```bash
cd /mnt/Dados/MindSolutions_StartUP/IndicAI
```

2. **Instale as dependências (se for a primeira vez)**:
```bash
npm install
# ou se estiver usando pnpm (padrão do projeto)
pnpm install
```

3. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
# ou
pnpm dev
```

O frontend será iniciado na porta `3000`:
- Acesse em: `http://localhost:3000`

## Configuração Necessária

Antes de iniciar, certifique-se de que o arquivo `.env.local` na raiz do projeto contém as chaves de API necessárias:

```
NEXT_PUBLIC_TMDB_API_KEY=sua_chave_do_tmdb_aqui
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_do_gemini_aqui
```

## Chaves de API

Para que o sistema funcione completamente, você precisará das seguintes chaves:

1. **TMDB API Key** - Para acessar o banco de dados de filmes e séries do The Movie Database
   - Acesse: https://www.themoviedb.org/settings/api
   - Crie uma conta e obtenha uma chave gratuita

2. **Gemini API Key** - Para o sistema de inteligência artificial que personaliza as recomendações
   - Acesse: https://aistudio.google.com/
   - Faça login e crie uma chave de API

Crie o arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_TMDB_API_KEY=sua_chave_do_tmdb_aqui
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_do_gemini_aqui
```

**Importante**: O sistema funciona com fallback para dados mockados caso as chaves não estejam configuradas, mas para a experiência completa das funcionalidades de IA e conteúdo real, as chaves são necessárias.

## Verificação Rápida

Após iniciar o frontend:

1. **Teste a integração com TMDB**:
   ```bash
   curl http://localhost:3000/api/test
   ```

2. **Teste a integração com Gemini**:
   ```bash
   curl http://localhost:3000/api/test-gemini
   ```

3. **Acesse o aplicativo** em `http://localhost:3000` e verifique:
   - O sistema deve carregar recomendações de filmes e séries reais do TMDB
   - Ao interagir com os cards (swipe), as preferências do usuário devem ser atualizadas
   - As recomendações subsequentes devem se tornar mais personalizadas

## Solução de Problemas Comuns

- **Nenhum conteúdo aparece**: Verifique se a chave da API do TMDB está configurada corretamente
- **Recomendações não estão personalizadas**: Verifique se a chave da API do Gemini está configurada
- **Frontend não carrega**: Verifique o console do navegador por erros
- **Erro de rede na API**: Pode haver limites de requisição da API do TMDB ou do Gemini
- **Interações não atualizam preferências**: Verifique se o localStorage está habilitado no navegador

## Comandos Úteis

**Parar o frontend**:
```bash
# Use Ctrl+C no terminal onde o frontend está rodando
```

**Verificar processos rodando**:
```bash
# Verificar se o frontend está rodando
ps aux | grep next | grep -v grep
```

**Testar o build do projeto**:
```bash
npm run build
```

**Rodar o lint**:
```bash
npm run lint
```

## ✨ Funcionalidades Disponíveis

Com o frontend rodando, você terá acesso a:

- **Recomendações personalizadas** baseadas nas preferências do usuário
- **Sistema de swipe** com feedback em tempo real
- **Integração exclusiva com TMDB** para conteúdo de alta qualidade
- **IA do Gemini** analisando perfis e sugerindo conteúdos com base no histórico de interações
- **Aprendizado contínuo** - o sistema melhora as sugestões com base nas interações do usuário
- **Persistência de preferências** no navegador
- **Sistema de fallback** para dados mockados quando APIs não estão disponíveis