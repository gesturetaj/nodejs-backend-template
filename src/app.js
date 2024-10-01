const express = require('express');
const xss = require('xss-clean');
const compression = require('compression');
const httpStatus = require('http-status');
const { middlewares, utils, configs } = require('@gesture/common-api');
const { serve } = require('inngest/express');
const { inngest } = require('./lib');
const functions = require('./inngest');
const config = require('./config');
const routes = require('./routes/v1');

const { morgan, error } = middlewares;
const { ApiError } = utils;
const {
  passport: { jwtStrategy },
} = configs;
const app = express();

// trust proxy
app.set('trust proxy', true);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// v1 api routes
app.use('/v1/', routes);

// Inngest setup
app.use('/v1/inngest', serve({ client: inngest, functions }));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(error.errorConverter);

// handle error
app.use(error.errorHandler);

module.exports = app;
