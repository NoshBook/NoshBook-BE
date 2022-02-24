const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  #passwordHash;
  showUserContent;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.#passwordHash = row.password_hash;
    this.showUserContent = row.show_user_content;
  }

  static async insert({ username, passwordHash, showUserContent }) {
    const { rows } = await pool.query(
      `
      INSERT INTO app_user (username, password_hash, show_user_content)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [username, passwordHash, showUserContent]
    );

    return new User(rows[0]);
  }

  static async getByUsername(username) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM app_user
      WHERE username=$1
      `,
      [username]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM app_user
      WHERE id=$1
      `,
      [id]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
