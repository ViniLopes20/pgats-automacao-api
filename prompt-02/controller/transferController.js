const transferService = require('../service/transferService');

exports.transfer = (req, res) => {
  try {
    const result = transferService.transfer(req.body);
    res.status(201).json({ message: 'Transferência realizada com sucesso', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTransfers = (req, res) => {
  res.json(transferService.getTransfers());
};
