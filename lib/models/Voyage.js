const pool = require("../utils/pool");

module.exports = class Voyage {
  id;
  duration;
  boatId;

  constructor(row) {
    this.id = String(row.id);
    this.duration = row.duration;
    this.boatId = String(row.boat_id);
  }

  static async insert({ duration, boatId }) {
    const { rows } = await pool.query(
      'INSERT INTO voyages (duration, boat_id) VALUES ($1, $2) RETURNING *',
      [duration, boatId]
    );

    return new Voyage(rows[0]);
  }
};
