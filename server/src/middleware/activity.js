const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const logActivity = (leadId, userId, action, detail = '') => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    db.run(
      `INSERT INTO activities (id, lead_id, user_id, action, detail) VALUES (?, ?, ?, ?, ?)`,
      [id, leadId, userId, action, detail],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

module.exports = { logActivity };
