# SARA

**Sistema de Apoio e Registro de Acolhimento** — aplicação web para registrar pessoas acolhidas e os encontros feitos com cada uma delas.

Apresentação do projeto: https://danbolotaro.github.io/sara-project/

## Sobre

O SARA mantém num só lugar quem é a pessoa acolhida, um pouco da sua história e o histórico de cada encontro: data, local, pedido de oração, anotações e contatos. Uma pessoa pode ter vários encontros; cada encontro pertence a uma única pessoa.

- Cadastro, edição e exclusão de pessoas.
- Registro, edição e exclusão de encontros vinculados a uma pessoa.
- Perfil da pessoa com o último encontro em destaque e o histórico completo.
- Acesso protegido por uma senha única, compartilhada pela equipe.

## Tecnologias

| Parte | O que usamos |
|---|---|
| Front-end e API | Next.js 16 (App Router), React 19 e TypeScript |
| Banco de dados | Supabase (PostgreSQL) |
| Notificações na tela | react-hot-toast |
| Testes | Playwright (end-to-end) |

## Como executar

### Requisitos

- [Node.js](https://nodejs.org) 20.12 ou mais recente (o npm já vem junto)
- Uma conta no [Supabase](https://supabase.com) (o plano gratuito serve)
- Git

### 1. Clonar e instalar

```bash
git clone https://github.com/danbolotaro/sara-project.git
cd sara-project
npm install
```

### 2. Criar o banco no Supabase

Crie um projeto novo no Supabase, abra o **SQL Editor** e rode o script abaixo.

```sql
create table person (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  gender      text check (gender in ('Masculino', 'Feminino')),
  age         integer,
  hometown    text,
  story       text,
  contacts    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table encounter (
  id              uuid primary key default gen_random_uuid(),
  person_id       uuid not null references person(id) on delete cascade,
  date            timestamptz not null,
  location        text,
  prayer_request  text,
  notes           text,
  contacts        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table person enable row level security;
alter table encounter enable row level security;
```

O `on delete cascade` apaga os encontros de uma pessoa quando ela é excluída. Com o RLS ligado e sem políticas, o banco só aceita a chave secreta usada pelo servidor.

### 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Preencha o `.env.local`:

| Variável | Valor |
|---|---|
| `SUPABASE_URL` | URL do projeto, em **Project Settings → API** |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave `service_role` (ou *secret key*), na mesma tela |
| `APP_PASSWORD` | A senha que será pedida na tela de login |
| `SESSION_SECRET` | Um texto aleatório longo, usado para assinar a sessão |

Para gerar o `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

O `.env.local` está no `.gitignore` e não vai para o repositório.

### 4. Executar

```bash
npm run dev
```

Abra http://localhost:3000 e entre com a senha definida em `APP_PASSWORD`.

Para a versão de produção:

```bash
npm run build
npm start
```

## Testes

Os testes end-to-end usam Playwright e rodam contra o banco configurado no `.env.local`. Na primeira vez, instale o navegador:

```bash
npx playwright install chromium
```

Depois:

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:report
```

Os testes criam e apagam registros de verdade. Prefira um projeto do Supabase separado para testes.

## Documentação

- [O sistema](docs/sistema.md): telas, API, autenticação, tabelas e estrutura do código.
- [Diagramas](docs/diagramas.md): caso de uso, DER e classes.

## Problemas comuns

- **Erro 500 ao entrar:** `APP_PASSWORD` ou `SESSION_SECRET` não estão no `.env.local`.
- **"Não foi possível carregar" nas listas:** confira `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Projetos gratuitos do Supabase pausam depois de um tempo sem uso; reative pelo painel.

---

Projeto de extensão · SARA
