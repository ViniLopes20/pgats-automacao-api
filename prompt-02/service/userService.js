const userModel = require('../model/userModel');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

function registerUser({ username, password, favorecido, saldo }) {
  if (!username || !password) {
    throw new Error('Nome de usuário e senha são obrigatórios');
  }
  if (userModel.findUserByUsername(username)) {
    throw new Error('Usuário já existe');
  }

  const user = {
    username,
    password,
    favorecido: !!favorecido,
    saldo: saldo !== undefined ? saldo : 0
  };
  userModel.addUser(user);

  return user;
}

function loginUser({ username, password }) {
  const user = userModel.getAllUsers().find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Credenciais inválidas');

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
}

function getUsers() {
  return userModel.getAllUsers();
}

module.exports = { registerUser, loginUser, getUsers };
