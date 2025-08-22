const userModel = require('../model/userModel');

function validateFields(username, password) {
  if (!username || !password) throw new Error('Nome de usuário e senha são obrigatórios');
}

function register({ username, password }) {
  validateFields(username, password);

  if (userModel.findUserByUsername(username)) throw new Error('Usuário já cadastrado');

  userModel.addUser({ username, password });
  return { username };
}

function login({ username, password }) {
  validateFields(username, password);

  const user = userModel.findUserByUsername(username);

  if (!user || user.password !== password) throw new Error('Credenciais inválidas');

  return { username };
}

function getUsers() {
  return userModel.getAllUsers();
}

module.exports = { register, login, getUsers };
