const express = require('express');
const Boat = require('./models/Boat');
const app = express();

app.use(express.json());

// endpoints

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

module.exports = app;
