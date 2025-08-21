const db = require('./db');

function findUserByUsername(username) {
  return db.users.find(u => u.username === username);
}

function addUser(user) {
  db.users.push(user);
}

function getAllUsers() {
  return db.users;
}

module.exports = { findUserByUsername, addUser, getAllUsers };
