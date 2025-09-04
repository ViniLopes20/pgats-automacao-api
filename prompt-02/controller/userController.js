const userService = require('../service/userService');

exports.register = (req, res) => {
  try {
    const user = userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  try {
    const { user, token } = userService.loginUser(req.body);
    res.status(200).json({ message: 'Login realizado com sucesso', user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.getUsers = (req, res) => {
  res.json(userService.getUsers());
};
