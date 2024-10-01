const express = require('express');
const { middlewares } = require('@listedb/common-api');
const { exampleValidation } = require('../../validations');
const { exampleController } = require('../../controllers/v1');

const { auth, validate } = middlewares;
const router = express.Router();

router
  .route('/')
  .get(auth(), validate(exampleValidation.getExamples), exampleController.getExamples);

module.exports = router;
