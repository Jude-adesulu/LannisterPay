const express = require('express');
const Route = express.Router();

const computeRoute = require('../controllers/compute.controller')

Route.post('/split-payments/compute', computeRoute.SplitPayment);

module.exports = Route;