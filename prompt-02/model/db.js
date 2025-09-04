// Banco de dados em memória
const db = {
  users: [
    {
      "username": "admin",
      "password": "12345678",
      "saldo": 1000,
      "favorecido": true
    }
  ],
  transfers: []
};

module.exports = db;
