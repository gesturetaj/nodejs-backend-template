const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging', 'test').required(),
    SERVICE_NAME: Joi.string().required().description('Name of the service'),
    SERVICE_SLUG: Joi.string().required().description('Slug of the service'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  serviceName: envVars.SERVICE_NAME,
  serviceSlug: envVars.SERVICE_SLUG,
};
