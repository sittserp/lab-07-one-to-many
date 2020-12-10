const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const Boat = require('../lib/models/Boat');
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
      id: '1',
      style: 'canoe',
      color: 'red',
      powered: 'paddle' });
  });

  it ('finds a boat by id via GET', async() => {
    const boat = await Boat.insert({
      style: 'canoe',
      color: 'red',
      powered: 'paddle'
    });

    const res = await request(app)
      .get(`/api/v1/boats/${boat.id}`);

    expect(res.body).toEqual(boat);
  });

  it('finds all boats via GET', async() => {
    const boats = await Promise.all([
      {
        style: 'canoe',
        color: 'red',
        powered: 'paddle'
      },
      {
        style: 'submarine',
        color: 'black',
        powered: 'nuclear'
      },
      {
        style: 'oil tanker',
        color: 'navy blue',
        powered: 'oil'
      }

    ].map(boat => Boat.insert(boat)));

    const res = await request(app)
      .get('/api/v1/boats');

    expect(res.body).toEqual(expect.arrayContaining(boats));
    expect(res.body).toHaveLength(boats.length);
  });

  it('updates a boat via PUT', async() => {
    const boat = await Boat.insert({
      style: 'canoe',
      color: 'red',
      powered: 'paddle'
    });

    const res = await request(app)
      .put(`/api/v1/boats/${boat.id}`)
      .send({
        style: 'ship',
        color: 'blue',
        powered: 'steam'
      });

    expect(res.body).toEqual({
      id: boat.id,
      style: 'ship',
      color: 'blue',
      powered: 'steam'
    });
  });

  it('deletes a boat via DELETE', async() => {
    const boat = await Boat.insert({
      style: 'canoe',
      color: 'red',
      powered: 'paddle'
    });

    const res = await request(app)
      .delete(`/api/v1/boats/${boat.id}`);

    expect(res.body).toEqual(boat);
  });
});
