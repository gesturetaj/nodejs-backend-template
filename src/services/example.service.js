const { Example } = require('../models');

/**
 * Get Examples
 * @returns {Promise}
 */
const getExamples = async () => {
  return Example.getExamples();
};


module.exports = {
  getExamples,
};
