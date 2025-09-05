const userService = require('../service/userService');
const transferService = require('../service/transferService');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

module.exports = {
  Query: {
    users: () => userService.getUsers(),
    transfers: (parent, args, context) => {
      if (!context.user) throw new Error('Não autenticado');
      return transferService.getTransfers();
    },
  },
  Mutation: {
    register: (parent, { username, password, favorecido, saldo }) => {
      return userService.registerUser({ username, password, favorecido, saldo });
    },
    login: (parent, { username, password }) => {
      const { user } = userService.loginUser({ username, password });
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      return { user, token };
    },
    transfer: (parent, { from, to, amount }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      return transferService.transfer({ from, to, amount });
    },
  },
};
