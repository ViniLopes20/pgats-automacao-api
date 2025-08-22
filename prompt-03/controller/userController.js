const userService = require('../service/userService');

exports.register = (req, res) => {
  try {
    const user = userService.register(req.body);
    res.status(201).json({ message: 'Usuário registrado com sucesso', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  try {
    const user = userService.login(req.body);
    res.status(200).json({ message: 'Login realizado com sucesso', user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.getUsers = (req, res) => {
  res.status(200).json({ users: userService.getUsers() });
};
