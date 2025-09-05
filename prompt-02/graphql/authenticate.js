const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

module.exports = function authenticate(req) {
  const auth = req.headers.authorization || '';
  let user = null;

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return {};
  try {
    const user = jwt.verify(token, JWT_SECRET);
    return { user };
  } catch {
    return {};
  }
};
