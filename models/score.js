const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

class Score {
  static async getAllScores() {
    result = await pool.query('SELECT * FROM scores');
    return result.rows;
  }

  static async getScoreById(id) {
    const result = await pool.query('SELECT * FROM scores WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async createScore({ user_id, score }) {
    const result = await pool.query(
      'INSERT INTO scores (user_id, score) VALUES ($1, $2) RETURNING *',
      [user_id, score]
    );
    return result.rows[0];
  }

  static async updateScore(id, { user_id, score }) {
    const result = await pool.query(
      'UPDATE scores SET user_id = $1, score = $2 WHERE id = $3 RETURNING *',
      [user_id, score, id]
    );
    return result.rows[0];
  }

  static async patchScore(id, data) {
    const keys = Object.keys(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = [...Object.values(data), id];
    const query = {
      text: `UPDATE scores SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      values,
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  static async deleteScore(id) {
    await pool.query('DELETE FROM scores WHERE id = $1', [id]);
  }
}

module.exports = Score;
