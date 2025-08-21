const db = require('./db');

function addTransfer(transfer) {
  db.transfers.push(transfer);
}

function getAllTransfers() {
  return db.transfers;
}

module.exports = { addTransfer, getAllTransfers };
