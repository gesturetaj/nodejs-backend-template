const Joi = require('joi');
const { validators, configs } = require('@listedb/common-api');

const getExamples = {
  query: Joi.object().keys({
    exampleId: Joi.string().required(),
  }),
};

module.exports = {
  getExamples,
};
