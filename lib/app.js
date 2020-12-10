const express = require('express');
const Boat = require('./models/Boat');
const Voyage = require('./models/Voyage');
const app = express();

app.use(express.json());

// Boat endpoints --------------------------------------------

app.post('/api/v1/boats', (req, res, next) => {
  Boat
    .insert(req.body)
    .then(boat => res.send(boat))
    .catch(next);
});

app.get('/api/v1/boats/:id', (req, res, next) => {
  Boat
    .findById(req.params.id)
    .then(boat => res.send(boat))
    .catch(next);
});

app.get('/api/v1/boats', (req, res, next) => {
  Boat
    .find()
    .then(boats => res.send(boats))
    .catch(next);
});

app.put('/api/v1/boats/:id', (req, res, next) => {
  Boat 
    .update(req.params.id, req.body)
    .then(boat => res.send(boat))
    .catch(next);
});

app.delete('/api/v1/boats/:id', (req, res, next) => {
  Boat
    .delete(req.params.id)
    .then(boat => res.send(boat))
    .catch(next);
});

// Voyage endpoints --------------------------------------------

app.post('/api/v1/voyages', (req, res, next) => {
  Voyage
    .insert(req.body)
    .then(voyage => res.send(voyage))
    .catch(next);
});

app.delete('/api/v1/voyages/:id', (req, res, next) => {
  Voyage
    .delete(req.params.id)
    .then(voyage => res.send(voyage))
    .catch(next);
});

app.put('/api/v1/voyages/:id', (req, res, next) => {
  Voyage 
    .update(req.params.id, req.body)
    .then(voyage => res.send(voyage))
    .catch(next);
});

module.exports = app;
