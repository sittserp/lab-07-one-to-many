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

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM boats WHERE id=$1',
      [id]
    );

    if(!rows[0]) throw new Error(`No boat with id ${id} found.`);

    return new Boat(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM boats');

    return rows.map(row => new Boat(row));
  }

  static async update(id, { style, color, powered }) {
    const { rows } = await pool.query(
      `UPDATE boats
        SET style=$1,
            color=$2,
            powered=$3
        WHERE id=$4
        RETURNING *`,
      [style, color, powered, id]
    );

    if(!rows[0]) throw new Error(`No boat with id ${id} found.`);
    return new Boat(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM boats WHERE id=$1 RETURNING *',
      [id]
    );
    if(!rows[0]) throw new Error(`No boat with id ${id} found.`);
    return new Boat(rows[0]);
  }
};
