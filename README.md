# 🐋 AUROVOX

> **Comunicação Aumentativa e Alternativa para todos que precisam de voz**

AUROVOX é um aplicativo web progressivo (PWA) desenvolvido como Trabalho de Conclusão de Curso (TCC) do IFPR — Campus Paranaguá. O sistema oferece um conjunto de ferramentas de Comunicação Aumentativa e Alternativa (CAA) para pessoas com dificuldades de fala ou comunicação verbal, como TEA (Transtorno do Espectro Autista), Apraxia da Fala, Paralisia Cerebral, Disartria e outras condições.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Configuração do Supabase](#configuração-do-supabase)
- [Configuração de Email](#configuração-de-email)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autora](#autora)

---

## Sobre o Projeto

O AUROVOX foi criado para facilitar a comunicação de pessoas que não conseguem se expressar verbalmente de forma completa ou eficaz. O app oferece cartões visuais de comunicação organizados por categorias, construção de frases, prontuário médico portátil e suporte à instalação como PWA em dispositivos móveis e desktop.

---

## Funcionalidades

### 🗣️ Comunicação
- **Cartões visuais** com pictogramas e texto organizados por categoria
- **Construtor de frases** para montar sentenças completas
- **Síntese de voz** para leitura em voz alta das frases montadas
- **Ordenação personalizada** dos cartões por arrastar e soltar (drag and drop)
- **Categorias** como Sentimentos, Necessidades, Alimentos, Ações e mais

### 👤 Perfil e Prontuário
- Cadastro completo com dados pessoais, clínicos e de comunicação
- Informações de emergência visíveis facilmente
- Campos de diagnóstico, medicações, alergias, tipo sanguíneo, peso e altura
- **Exportação do prontuário como imagem PNG** em layout de duas colunas

### 🔐 Autenticação
- Cadastro e login com email e senha
- Recuperação de senha com link por email (template personalizado AUROVOX)
- Tela de redefinição de senha com checklist de segurança
- Logout disponível em todas as telas

### 📱 PWA
- Instalável em Android, iOS, Windows e macOS
- Funciona offline após instalação
- Ícone e tela de splash personalizados

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Estilização | Tailwind CSS + shadcn/ui |
| Roteamento | React Router DOM v6 |
| Backend / Auth / DB | Supabase |
| Email transacional | Supabase Auth (template customizado) |
| PWA | vite-plugin-pwa |
| Drag and Drop | dnd-kit |
| Formulários | React Hook Form + Zod |
| Ícones | Lucide React |
| Notificações | Sonner |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior
- Conta no [Supabase](https://supabase.com/) (gratuita)
- Supabase CLI: `npm install -g supabase`

---

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/aurovox.git
cd aurovox
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```dotenv
VITE_SUPABASE_URL="https://SEU_PROJECT_ID.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_anon_key_aqui"
VITE_SUPABASE_PROJECT_ID="seu_project_id_aqui"
```

### 4. Execute o projeto

```bash
npm run dev
```

Acesse em: `http://localhost:8080`

### 5. Build para produção

```bash
npm run build
```

---

## Configuração do Supabase

### Linkar o projeto

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_ID
```

### Aplicar as migrations do banco de dados

```bash
npx supabase db push
```

Isso criará as tabelas necessárias, incluindo `profiles` com todos os campos do prontuário.

### Tabela `profiles` — campos principais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | Referência ao usuário autenticado |
| `name` | text | Nome completo |
| `email` | text | Email |
| `has_tea` | boolean | Possui TEA |
| `tea_level` | text | Nível do TEA (1, 2 ou 3) |
| `diagnosis` | text | Diagnóstico / condição |
| `blood_type` | text | Tipo sanguíneo |
| `weight` | text | Peso (kg) |
| `height` | text | Altura (cm) |
| `allergies` | text | Alergias |
| `medications` | text | Medicações em uso |
| `emergency_contact` | text | Nome do contato de emergência |
| `emergency_phone` | text | Telefone de emergência |
| `preferred_communication` | text | Método de comunicação preferido |
| `sensory_sensitivities` | text | Sensibilidades sensoriais |
| `routine_notes` | text | Observações de rotina |
| `share_enabled` | boolean | Permite exportar o perfil |

---

## Configuração de Email

O AUROVOX usa o serviço de email nativo do Supabase com template customizado. Para configurar:

1. Acesse o painel do Supabase → **Authentication → Email Templates**
2. Selecione **Reset Password**
3. Altere o assunto para: `Redefinição de senha — AUROVOX`
4. Substitua o corpo pelo template personalizado com a identidade visual do AUROVOX

> O serviço gratuito do Supabase suporta até **3 emails por hora**, suficiente para desenvolvimento e apresentação do TCC.

---

## Estrutura do Projeto

```
aurovox/
├── public/
│   ├── favicon.png
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   ├── Header.tsx           # Cabeçalho com nav e logout
│   │   ├── CardGrid.tsx         # Grade de cartões de comunicação
│   │   ├── CommunicationCard.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── PhraseBuilder.tsx    # Construtor de frases com voz
│   │   └── InstallPWA.tsx
│   ├── hooks/
│   │   └── useAuth.tsx          # Contexto de autenticação
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── pages/
│   │   ├── Index.tsx            # Tela principal com os cartões
│   │   ├── Auth.tsx             # Login, cadastro e esqueci a senha
│   │   ├── Profile.tsx          # Perfil e prontuário médico
│   │   ├── ResetPassword.tsx    # Redefinição de senha
│   │   └── Install.tsx          # Guia de instalação do PWA
│   └── App.tsx
├── supabase/
│   ├── functions/
│   │   └── send-reset-email/    # Edge Function (opcional)
│   └── migrations/              # Migrations do banco de dados
├── .env
├── package.json
└── vite.config.ts
```

---

## Autora

**Yasmim Russi**
Estudante do IFPR — Instituto Federal do Paraná, Campus Paranaguá
Curso Técnico em Informática

> Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) — 2026

---

*AUROVOX — Comunicação para todos que precisam de voz* 🐋