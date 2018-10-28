const util = require('util');
const {isTruthy} = require('../utils/truthy.utils');
const {finished} = require('stream');
const finishHandler = util.promisify(finished);
const osUtils = require('../utils/os.utils');
const path = osUtils.path();
const fs = require('fs');

const handleFinish = spinner => async (stream, text, callback = null) => {
  await finishHandler(stream);
  if (isTruthy(spinner)) {
    spinner.succeed(text);
  }

  if (callback) {
    callback();
  }
};

const handleError = err => {
  console.log('ERROR HANDLED', err);
  process.exit(-1);
};

const tempPath = path.join(__dirname, '..', '..', 'build', 'tmp', '/');

module.exports = {handleError, handleFinish, tempPath};
