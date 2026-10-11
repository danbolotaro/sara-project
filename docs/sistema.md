# O sistema

O que o SARA faz e como ele está organizado.

## Visão geral

O sistema gira em torno de duas coisas: **pessoas** e **encontros**. Uma pessoa é cadastrada uma vez, com nome, gênero, idade, cidade de origem, história e contatos. Cada vez que alguém se encontra com ela, registra-se um encontro com data, local, pedido de oração, anotações e contatos. Uma pessoa pode ter vários encontros; cada encontro pertence a uma única pessoa.

## Funcionalidades

### Pessoas

- Listar pessoas cadastradas, em ordem alfabética.
- Cadastrar uma nova pessoa (só o nome é obrigatório).
- Ver o perfil da pessoa, com o último encontro e o histórico de encontros.
- Editar e excluir o cadastro.

### Encontros

- Listar todos os encontros, do mais recente para o mais antigo.
- Registrar um encontro vinculado a uma pessoa (pessoa e data são obrigatórias; a data já vem preenchida com o momento atual).
- Ver os detalhes de um encontro: local, pedido de oração, anotações e contatos.
- Editar e excluir o encontro.

## Autenticação

O acesso é protegido por uma senha única, definida na variável `APP_PASSWORD`. Não há cadastro de usuários.

- A tela `/login` envia a senha para `POST /api/auth/login`.
- Se a senha estiver certa, o servidor grava um cookie de sessão assinado, `httpOnly`, válido por 7 dias.
- O arquivo `src/proxy.ts` intercepta todas as requisições: sem sessão válida, páginas são redirecionadas para `/login` e rotas de API respondem `401`.
- Cada rota de dados confere a sessão novamente antes de acessar o banco.
- O botão **Sair** chama `POST /api/auth/logout`, que apaga o cookie.

## Telas

| Rota | Tela |
|---|---|
| `/login` | Entrada com a senha do sistema |
| `/` | Redireciona para `/persons` |
| `/persons` | Lista de pessoas |
| `/persons/new` | Cadastro de pessoa |
| `/persons/[id]` | Perfil da pessoa e seus encontros |
| `/persons/[id]/more` | Dados completos e exclusão |
| `/persons/[id]/edit` | Edição de pessoa |
| `/encounters` | Lista de encontros |
| `/encounters/new` | Registro de encontro |
| `/encounters/[id]` | Detalhes do encontro |
| `/encounters/[id]/edit` | Edição de encontro |

## API

As telas conversam com rotas de API do próprio Next.js (`src/app/api`), que por sua vez acessam o Supabase. Todas recebem e devolvem JSON. Com exceção das rotas de autenticação, todas exigem sessão e respondem `401` sem ela.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Valida a senha e abre a sessão |
| POST | `/api/auth/logout` | Encerra a sessão |
| GET | `/api/persons` | Lista pessoas |
| POST | `/api/persons` | Cria pessoa |
| GET | `/api/persons/:id` | Busca uma pessoa |
| PUT | `/api/persons/:id` | Atualiza pessoa |
| DELETE | `/api/persons/:id` | Exclui pessoa |
| GET | `/api/encounters` | Lista encontros (aceita `?person_id=` para filtrar) |
| POST | `/api/encounters` | Cria encontro |
| GET | `/api/encounters/:id` | Busca um encontro |
| PUT | `/api/encounters/:id` | Atualiza encontro |
| DELETE | `/api/encounters/:id` | Exclui encontro |

### Regras de validação

- Pessoa precisa ter `name`.
- `gender`, quando informado, deve ser `Masculino` ou `Feminino`.
- Encontro precisa de `person_id` e `date`, e a pessoa tem que existir.

### Respostas de erro

| Status | Quando |
|---|---|
| `400` | Dados obrigatórios ausentes ou inválidos |
| `401` | Sem sessão válida, ou senha incorreta no login |
| `404` | Registro não encontrado |
| `500` | Falha ao acessar o banco |

## Dados

O banco no Supabase tem duas tabelas. A modelagem completa pensada para o projeto está no [DER](diagramas.md#der).

### `person`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | uuid | Chave primária |
| `name` | text | Obrigatório |
| `gender` | text | Masculino ou Feminino |
| `age` | integer | |
| `hometown` | text | Cidade de origem |
| `story` | text | História da pessoa |
| `contacts` | text | |
| `created_at` / `updated_at` | timestamptz | |

### `encounter`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | uuid | Chave primária |
| `person_id` | uuid | Referência a `person.id` |
| `date` | timestamptz | Obrigatório |
| `location` | text | |
| `prayer_request` | text | Pedido de oração |
| `notes` | text | Anotações |
| `contacts` | text | |
| `created_at` / `updated_at` | timestamptz | |

## Estrutura do código

```
src/
├── app/
│   ├── api/          rotas da API (auth, persons e encounters)
│   ├── login/        tela de entrada
│   ├── persons/      telas de pessoas
│   ├── encounters/   telas de encontros
│   ├── layout.tsx    layout base com o menu
│   └── globals.css
├── components/       formulários, cards, cabeçalho, estados e diálogo
├── lib/              cliente do Supabase, sessão, chamadas à API e utilitários
├── types/            tipos TypeScript (Person, Encounter)
└── proxy.ts          bloqueio de acesso sem sessão
tests/e2e/            testes com Playwright
docs/                 documentação e página de apresentação
```
