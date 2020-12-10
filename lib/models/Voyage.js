const pool = require('../utils/pool');

module.exports = class Voyage {
  id;
  duration;
  boatId;

  constructor(row) {
    this.id = String(row.id);
    this.duration = String(row.duration);
    this.boatId = String(row.boat_id);
  }

  static async insert({ duration, boatId }) {
    const { rows } = await pool.query(
      'INSERT INTO voyages (duration, boat_id) VALUES ($1, $2) RETURNING *',
      [duration, boatId]
    );

    return new Voyage(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM voyages WHERE id=$1 RETURNING *',
      [id]
    );
    if(!rows[0]) throw new Error(`No voyage with id ${id} found.`);
    return new Voyage(rows[0]);
  }

  static async update(id, { duration, boatId }) {
    const { rows } = await pool.query(
      `UPDATE voyages
        SET duration=$1,
            boat_id=$2
        WHERE id=$3
        RETURNING *`,
      [duration, boatId, id]
    );

    if(!rows[0]) throw new Error(`No voyage with id ${id} found.`);
    return new Voyage(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM voyages');

    return rows.map(row => new Voyage(row));
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM voyages WHERE id=$1', [id]);

    if(!rows[0]) throw new Error(`No voyage with id ${id} found.`);
    return new Voyage(rows[0]);
  }

};
