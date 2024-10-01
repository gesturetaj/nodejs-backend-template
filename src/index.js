
require('dotenv').config();
const { createTerminus } = require('@godaddy/terminus');
const { version } = require('../package.json');
const config = require('./config');
const app = require('./app');

const { logger, analytics } = utils;

const startServer = async () => {
  // * Database + Queue connections
  // * Prisma connection

  // * Start server
  const server = app.listen(config.port, () => {
    logger.info(`${config.serviceName} version ${version} listening on port ${config.port} in ${config.env} mode`);
  });

  ['unhandledRejection', 'uncaughtException'].forEach((type) => {
    process.on(type, (error) => {
      logger.error(`${type} error occurred`, { error });
    });
  });

  // * Graceful Shutdown & Health Check Setup * //

  const onSignal = async () => {
    logger.info(`${config.serviceName} terminating all connections`);

    // * All other connections
    return Promise.all([analytics.flush()]);
  };

  const beforeShutdown = () => {
    logger.info(`${config.serviceName} shutdown request received`);

    // * Wait for kubernetes readiness probe to fail
    if (config.env !== 'development') {
      return new Promise((resolve) => {
        setTimeout(resolve, 12000);
      });
    }
  };

  const onShutdown = () => {
    logger.info(`${config.serviceName} terminated all connections successfully`);
  };

  const healthCheck = () => {
    // * Check if Postgres is connected and return a promise
    return Promise.resolve();
  };

  const options = {
    healthChecks: { '/healthz': healthCheck },
    timeout: 5000, // * Wait 5 seconds before server forcefully shuts down
    signals: ['SIGTERM', 'SIGINT', 'unhandledRejection', 'uncaughtException'],
    statusOkResponse: { status: 'up' },
    statusErrorResponse: { status: 'down' },
    useExit0: true,
    beforeShutdown,
    onSignal,
    onShutdown,
    logger: logger.error,
  };

  createTerminus(server, options);
};

startServer();
