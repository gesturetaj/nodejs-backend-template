const express = require('express');
const exampleRoute = require('./example.route');
const config = require('../../config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/examples',
    route: exampleRoute,
  },
];

const devRoutes = [];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
