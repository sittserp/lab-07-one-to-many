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

module.exports = app;
