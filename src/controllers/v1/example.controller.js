const httpStatus = require('http-status');
const { exampleService } = require('../../services');

const getExamples = async (req, res) => {
  const examples = await exampleService.getExamples();
  res.status(httpStatus.OK).send(examples);
};

module.exports = {
  getExamples,
};
