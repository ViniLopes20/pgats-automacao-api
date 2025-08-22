# API de Login - prompt-03

API simples para registro e login de usuários, com separação entre Controller, Service e Model. Testes automatizados com Mocha, Chai, Sinon e SuperTest. Documentação via Swagger.

## Instalação

```bash
npm install
```

## Inicialização

```bash
npm start
```

## Endpoints

- `POST /login`: Realiza login. Campos obrigatórios: `username`, `password`.
- `POST /register`: Registra um novo usuário. Campos obrigatórios: `username`, `password`.
- `GET /users`: Lista todos os usuários registrados.

## Testes

Execute os testes automatizados:

```bash
npm test
```

Os testes isolam o Controller do Service usando Sinon, Mocha, Chai e SuperTest.

## Documentação Swagger

O arquivo `swagger.json` documenta os endpoints da API. Para integrar o Swagger UI, instale o pacote `swagger-ui-express` e adicione ao `app.js`:

```js
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

Acesse `/api-docs` para visualizar e testar os endpoints.

## CI/CD

A pipeline está configurada via GitHub Actions para rodar os testes automaticamente a cada push, pull request ou manualmente
