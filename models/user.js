const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

class User {
  static async getAllUsers() {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  }

  static async getUserById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async createUser({ username, password }) {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    return result.rows[0];
  }

  static async updateUser(id, { username, password }) {
    const result = await pool.query(
      'UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *',
      [username, password, id]
    );
    return result.rows[0];
  }

  static async patchUser(id, data) {
    const keys = Object.keys(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = [...Object.values(data), id];
    const query = {
      text: `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      values,
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  static async deleteUser(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

module.exports = User;
