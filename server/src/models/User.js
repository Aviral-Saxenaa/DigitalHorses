const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const User = {
  create({ name, email, password, role = 'member' }) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const hashed = bcrypt.hashSync(password, 10);
      db.run(
        `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        [id, name, email, hashed, role],
        function (err) {
          if (err) return reject(err);
          resolve({ id, name, email, role });
        }
      );
    });
  },

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  findById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT id, name, email, role, created_at FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  findAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = User;
