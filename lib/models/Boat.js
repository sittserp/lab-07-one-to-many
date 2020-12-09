const pool = require('../utils/pool');

module.exports = class Boat {
  id;
  style;
  color;
  powered;

  constructor(row) {
    this.id = row.id;
    this.style = row.style;
    this.color = row.color;
    this.powered = row.powered;
  }

  static async insert({ style, color, powered }) {
    const { rows } = await pool.query(
      'INSERT INTO boats (style, color, powered) VALUES ($1, $2, $3) RETURNING *',
      [style, color, powered]
    );

    return new Boat(rows[0]);
  }
};
