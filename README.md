Segue o **README completo reestruturado**, organizado, técnico e pronto para você copiar e colar no seu repositório:

---

# 🎓 AUROVOX – 2026

## Sistema Web Progressivo (PWA) – Trabalho de Conclusão de Curso

🔗 **Repositório Oficial:**
[https://github.com/YASMIMRM06/AUROVOX---2026-TCC](https://github.com/YASMIMRM06/AUROVOX---2026-TCC)

---

## 📌 Sobre o Projeto

O **AUROVOX** é uma aplicação web desenvolvida como Trabalho de Conclusão de Curso (TCC) – 2026.

O sistema foi projetado como uma **Progressive Web App (PWA)**, oferecendo experiência moderna, responsiva e compatível com dispositivos móveis. A arquitetura é baseada em componentes reutilizáveis, utilizando React e TypeScript para garantir organização, escalabilidade e segurança estrutural do código.

O projeto demonstra a aplicação prática de:

* Desenvolvimento Front-End moderno
* Arquitetura baseada em componentes
* Tipagem estática com TypeScript
* Configuração de PWA
* Testes automatizados

---

## 🛠 Tecnologias Utilizadas

* **Vite** – Build tool moderna e performática
* **React** – Biblioteca para construção de interfaces
* **TypeScript** – Tipagem estática
* **Tailwind CSS** – Estilização utilitária e responsiva
* **shadcn-ui** – Biblioteca de componentes acessíveis
* **Vitest** – Testes automatizados
* **Node.js & npm** – Gerenciamento de dependências

---

## 📂 Estrutura do Projeto

### 🔹 Diretório `public/`

Arquivos estáticos e configurações da PWA:

```
public/
 ├── icons/                 # Ícones em múltiplas resoluções (PWA)
 ├── favicon.ico            # Ícone do navegador
 ├── manifest.json          # Configuração da Progressive Web App
 ├── placeholder.svg
 └── robots.txt
```

O arquivo `manifest.json` e os ícones em diferentes tamanhos permitem que o sistema seja instalado como aplicativo em dispositivos móveis e desktops.

---

### 🔹 Diretório `src/`

Código-fonte principal da aplicação:

```
src/
 ├── components/            # Componentes reutilizáveis
 │    ├── ui/               # Componentes base (shadcn-ui)
 │    ├── CardGrid.tsx
 │    ├── CategoryTabs.tsx
 │    ├── CommunicationCard.tsx
 │    ├── Header.tsx
 │    ├── InstallPWA.tsx
 │    ├── NavLink.tsx
 │    ├── PhraseBuilder.tsx
 │    └── SortableCard.tsx
 │
 ├── data/                  # Dados estáticos
 │    └── communicationCards.ts
 │
 ├── hooks/                 # Hooks customizados
 │    ├── use-mobile.tsx
 │    ├── use-toast.ts
 │    └── useSpeechSynthesis.ts
 │
 ├── lib/                   # Funções utilitárias
 │    └── utils.ts
 │
 ├── pages/                 # Páginas principais
 │    ├── Index.tsx
 │    ├── Install.tsx
 │    └── NotFound.tsx
 │
 ├── test/                  # Testes automatizados
 │    ├── example.test.ts
 │    └── setup.ts
 │
 ├── App.tsx                # Componente raiz
 ├── main.tsx               # Ponto de entrada
 ├── App.css
 ├── index.css
 └── vite-env.d.ts
```

---

## 🧠 Arquitetura do Sistema

O AUROVOX adota:

* Arquitetura modular baseada em componentes
* Separação de responsabilidades (UI, lógica e dados)
* Hooks customizados para encapsular lógica reutilizável
* Componentização de interface com shadcn-ui
* Estrutura compatível com Progressive Web App (PWA)

---

## 🚀 Como Executar o Projeto Localmente

### ✅ Pré-requisitos

* Node.js instalado (recomendado via nvm)
* npm instalado

---

### ▶ Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/YASMIMRM06/AUROVOX---2026-TCC.git

# 2. Acessar a pasta do projeto
cd AUROVOX---2026-TCC

# 3. Instalar dependências
npm install

# 4. Executar o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:5173
```

---

## 🧪 Testes Automatizados

Para executar os testes:

```bash
npm run test
```

O projeto utiliza **Vitest** para validação automatizada de funcionalidades.

---

## 🌐 Deploy

A aplicação pode ser publicada em plataformas compatíveis com Vite/React ou via Lovable.

Após o deploy, a aplicação poderá ser instalada como PWA em dispositivos compatíveis.

---

## 🎓 Contexto Acadêmico

Projeto desenvolvido como requisito para obtenção do título de graduação – 2026.

O sistema demonstra domínio prático de:

* Desenvolvimento Front-End moderno
* Estruturação profissional de projetos
* Versionamento com Git e GitHub
* Arquitetura escalável baseada em componentes
* Configuração e implementação de PWA

---

## 👩‍💻 Autora

**Yasmim Russi Mariano**
Trabalho de Conclusão de Curso – 2026


