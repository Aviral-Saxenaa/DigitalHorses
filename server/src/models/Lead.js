const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Lead = {
  create({ name, email, phone, company, source = 'web', notes, assigned_to }) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      db.run(
        `INSERT INTO leads (id, name, email, phone, company, source, notes, assigned_to)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, email, phone || null, company || null, source, notes || null, assigned_to || null],
        function (err) {
          if (err) return reject(err);
          resolve({ id, name, email, phone, company, source, notes, assigned_to, status: 'new' });
        }
      );
    });
  },

  findAll({ page = 1, limit = 10, status, assigned_to, search } = {}) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      let where = [];
      let params = [];

      if (status) { where.push('l.status = ?'); params.push(status); }
      if (assigned_to) { where.push('l.assigned_to = ?'); params.push(assigned_to); }
      if (search) { where.push('(l.name LIKE ? OR l.email LIKE ? OR l.company LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

      const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

      db.get(`SELECT COUNT(*) as total FROM leads l ${whereClause}`, params, (err, countRow) => {
        if (err) return reject(err);
        db.all(
          `SELECT l.*, u.name as assigned_name
           FROM leads l LEFT JOIN users u ON l.assigned_to = u.id
           ${whereClause}
           ORDER BY l.created_at DESC LIMIT ? OFFSET ?`,
          [...params, limit, offset],
          (err, rows) => {
            if (err) return reject(err);
            resolve({ leads: rows, total: countRow.total, page, limit });
          }
        );
      });
    });
  },

  findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT l.*, u.name as assigned_name FROM leads l LEFT JOIN users u ON l.assigned_to = u.id WHERE l.id = ?`,
        [id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  },

  update(id, data) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];
      for (const [key, val] of Object.entries(data)) {
        if (val !== undefined && ['name', 'email', 'phone', 'company', 'status', 'source', 'notes', 'assigned_to'].includes(key)) {
          fields.push(`${key} = ?`);
          params.push(val);
        }
      }
      if (!fields.length) return reject(new Error('No fields to update'));
      fields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);

      db.run(`UPDATE leads SET ${fields.join(', ')} WHERE id = ?`, params, function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM leads WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};

module.exports = Lead;
