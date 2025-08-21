const userModel = require('../model/userModel');
const transferModel = require('../model/transferModel');

function validateUsers(sender, recipient, from, to) {
  if (!sender || !recipient) throw new Error('Usuário não encontrado');
  if (from === to) throw new Error('Não é possível transferir para si mesmo');
}

function validateFavorecido(recipient, amount) {
  if (!recipient.favorecido && amount > 5000) {
    throw new Error('Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos');
  }
}

function validateSaldo(sender, amount) {
  if (typeof sender.saldo !== 'number' || sender.saldo < amount) {
    throw new Error('Saldo insuficiente');
  }
}

function transfer({ from, to, amount }) {
  const sender = userModel.findUserByUsername(from);
  const recipient = userModel.findUserByUsername(to);

  validateUsers(sender, recipient, from, to);
  validateFavorecido(recipient, amount);
  validateSaldo(sender, amount);

  sender.saldo -= amount;
  recipient.saldo = (typeof recipient.saldo === 'number' ? recipient.saldo : 0) + amount;
  transferModel.addTransfer({ from, to, amount, date: new Date() });

  return { from, to, amount };
}

function getTransfers() {
  return transferModel.getAllTransfers();
}

module.exports = { transfer, getTransfers };
