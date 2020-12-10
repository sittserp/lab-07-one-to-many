const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const Boat = require('../lib/models/Boat');
const Voyage = require('../lib/models/Voyage');
const pool = require('../lib/utils/pool');

describe('app endpoint', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  // Boat Class CRUD Route Tests --------------------------------------------

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

  it ('finds a boat by id and all associated voyages via GET', async() => {
    const boat = await Boat.insert({
      style: 'canoe',
      color: 'red',
      powered: 'paddle'
    });

    const voyages = await Promise.all([
      { duration: 10, boatId: boat.id },
      { duration: 55, boatId: boat.id },
      { duration: 15, boatId: boat.id },
    ].map(voyage => Voyage.insert(voyage)));

    const res = await request(app)
      .get(`/api/v1/boats/${boat.id}`);

    expect(res.body).toEqual({
      ...boat,
      voyages: expect.arrayContaining(voyages)
    });
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

  // Voyage Class CRUD Route Tests --------------------------------------------

  it('creates a new voyage via POST', async() => {
    const boat = await Boat.insert({
      style: 'canoe',
      color: 'red',
      powered: 'paddle'
    });
    
    const res = await request(app)
      .post('/api/v1/voyages')
      .send({
        duration: 10,
        boatId: boat.id
      });

    expect(res.body).toEqual({ 
      id: '1',
      duration: '10',
      boatId: '1' });
  });

  it('finds all voyages via GET', async() => {

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

    const voyages = await Promise.all([
      {
        duration: '10',
        boatId: boats[0].id,
      },
      {
        duration: '20',
        boatId: boats[1].id,
      },
      {
        duration: '30',
        boatId: boats[2].id,
      }

    ].map(voyage => Voyage.insert(voyage)));

    const res = await request(app)
      .get('/api/v1/voyages');

    expect(res.body).toEqual(expect.arrayContaining(voyages));
    expect(res.body).toHaveLength(voyages.length);
  });

  it ('finds a voyage by id via GET', async() => {
    const boat = await Boat.insert({
      style: 'canoe',
      color: 'red',
      powered: 'paddle'
    });

    const voyage = await Voyage.insert({
      duration: '10',
      boatId: boat.id
    });

    const res = await request(app)
      .get(`/api/v1/voyages/${voyage.id}`);

    expect(res.body).toEqual({
      id: voyage.id,
      duration: '10',
      boatId: boat.id
    });
  });

  it('updates a voyage via PUT', async() => {
    const boat = await Boat.insert({
      style: 'canoe',
      color: 'red',
      powered: 'paddle'
    });

    const voyage = await Voyage.insert({
      duration: '10',
      boatId: boat.id
    });

    const res = await request(app)
      .put(`/api/v1/voyages/${voyage.id}`)
      .send({
        duration: '20',
        boatId: boat.id
      });

    expect(res.body).toEqual({
      id: voyage.id,
      duration: '20',
      boatId: boat.id
    });
  });

  it('deletes a voyage via DELETE', async() => {

    const boat = await Boat.insert({
      style: 'canoe',
      color: 'red',
      powered: 'paddle'
    });

    const voyage = await Voyage.insert({
      duration: '10',
      boatId: boat.id
    });

    const res = await request(app)
      .delete(`/api/v1/voyages/${voyage.id}`);

    expect(res.body).toEqual(voyage);
  });

});
