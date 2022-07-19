const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const baseRoute = express.Router();
const splitPaymentRoute = require('./routes/compute-route')

// create express app
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

//Base route

app.get('/', (req, res) => res.status(200).send({
    message: 'LannisterPay (TPSS) api Welcome api page',
  }));

//Computation route
app.use('/', baseRoute);
app.use('/', splitPaymentRoute);

module.exports = app;
