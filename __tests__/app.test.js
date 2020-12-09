const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');

describe('app endpoint', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new boat via POST', async() => {
    const res = await request(app)
      .post('/api/v1/boats')
      .send({
        style: 'canoe',
        color: 'red',
        powered: 'paddle'
      });

    expect(res.body).toEqual({ 
      style: 'canoe',
      color: 'red',
      powered: 'paddle' });
  });
});
