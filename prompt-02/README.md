# API de Transferências

Esta API permite login, registro de usuários, consulta de usuários e transferência de valores entre usuários. O banco de dados é em memória e a documentação está disponível via Swagger.

## Instalação

```bash
npm install
```

## Inicialização REST

```bash
npm start
```

## Inicialização GraphQL

```bash
cd graphql
node server.js
```

O servidor GraphQL ficará disponível em `http://localhost:4000/graphql`.

## Endpoints REST

- `POST /login`: Realiza login. Campos obrigatórios: `username`, `password`.
- `POST /register`: Registra um novo usuário. Campos obrigatórios: `username`, `password`. Opcional: `favorecido` (boolean) e `saldo` (number).
- `GET /users`: Lista todos os usuários cadastrados.
- `POST /transfer`: Realiza transferência. Campos obrigatórios: `from`, `to`, `amount`.
- `GET /transfers`: Lista todas as transferências realizadas.
- `GET /api-docs`: Documentação Swagger da API.

## API GraphQL

### Queries

- `users`: Lista todos os usuários cadastrados.
- `transfers`: Lista todas as transferências realizadas (requer autenticação JWT).

### Mutations

- `register(username, password, favorecido, saldo)`: Registra um novo usuário.
- `login(username, password)`: Realiza login e retorna um token JWT.
- `transfer(from, to, amount)`: Realiza transferência (requer autenticação JWT).

Para autenticar, envie o header:

```
Authorization: Bearer <token>
```

## Regras de Negócio

- Não é permitido registrar usuários duplicados.
- Não é possível cadastrar usuário sem nome ou senha.
- Login exige usuário e senha válidos.
- Transferências para destinatários não favorecidos só podem ser feitas se o valor for menor ou igual que R$ 5.000,00.
- Transferências para si mesmo não são permitidas.
- Não é possível transferir se o saldo for insuficiente.
- Transferências debitam o saldo do remetente e creditam o saldo do destinatário.

## Testes

A API foi estruturada para facilitar testes automatizados com Supertest. Importe o `app.js` para testar sem iniciar o servidor.

## Documentação

Acesse `/api-docs` para visualizar e testar os endpoints via Swagger.
