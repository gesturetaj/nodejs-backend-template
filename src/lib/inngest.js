const { Inngest } = require('inngest');

const { serviceName } = require('../config/config');

const inngest = new Inngest({ id: serviceName });

module.exports = inngest;
