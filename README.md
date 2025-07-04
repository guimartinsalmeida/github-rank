# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# GitHub Heatmap Squad 🚀

Uma aplicação moderna e elegante para acompanhar a atividade dos desenvolvedores do seu projeto através dos mapas de commits do GitHub.

## ✨ Características

- **Interface Moderna**: Design responsivo com gradientes, glass morphism e animações suaves
- **Dashboard Completo**: Estatísticas em tempo real da equipe
- **Mapas de Atividade**: Visualização dos commits dos últimos 365 dias
- **Ranking Automático**: Ordenação automática por atividade
- **Status Visual**: Indicadores visuais do nível de atividade de cada desenvolvedor
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🎨 Melhorias de UI Implementadas

### Design System
- **Tipografia**: Fonte Inter para melhor legibilidade
- **Cores**: Paleta moderna com gradientes roxo/azul
- **Efeitos**: Glass morphism, sombras e animações suaves
- **Componentes**: Cards elegantes com hover effects

### Funcionalidades Visuais
- **Loading Animado**: Spinner duplo com feedback visual
- **Status Badges**: Indicadores coloridos para nível de atividade
- **Estatísticas**: Cards com métricas da equipe
- **Troféu**: Badge especial para o desenvolvedor mais ativo
- **Legend**: Legenda explicativa para o heatmap

### Experiência do Usuário
- **Feedback Visual**: Hover effects e transições suaves
- **Informações Detalhadas**: Estatísticas por desenvolvedor
- **Layout Responsivo**: Adaptação para diferentes tamanhos de tela
- **Acessibilidade**: Contraste adequado e navegação intuitiva

## 🚀 Como Usar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` com:
   ```
   VITE_GITHUB_CLIENT_ID=seu_client_id_aqui
   ```

3. **Executar o projeto**:
   ```bash
   npm run dev
   ```

4. **Conectar contas GitHub**:
   - Clique em "Conectar nova conta GitHub"
   - Autorize o acesso
   - Veja os mapas de atividade automaticamente

## 📊 Métricas Disponíveis

- **Total de Desenvolvedores**: Número de contas conectadas
- **Total de Commits**: Soma de todos os commits da equipe
- **Média por Dev**: Commits médios por desenvolvedor
- **Mais Ativo**: Desenvolvedor com mais commits
- **Dias Ativos**: Dias com commits por desenvolvedor
- **Dia Mais Ativo**: Data com maior número de commits

## 🎯 Status de Atividade

- 🧊 **Inativo**: 0 commits
- ⚠️ **Quase parado**: 1-9 commits
- 🔥 **Engrenando**: 10-29 commits
- 🚀 **On Fire**: 30+ commits

## 🛠️ Tecnologias

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Heatmap**: react-calendar-heatmap
- **Backend**: Node.js (separado)
- **Fontes**: Inter (Google Fonts)

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Personalização

O design pode ser facilmente personalizado através dos arquivos:
- `src/index.css`: Estilos globais e variáveis CSS
- `tailwind.config.js`: Configuração do Tailwind
- Componentes individuais para modificações específicas

---

Desenvolvido com ❤️ para acompanhar o crescimento da sua equipe de desenvolvimento!
# admira-commit-rank
