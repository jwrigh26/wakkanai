const util = require('util');

const {isTruthy} = require('../utils/truthy.utils');
const {finished} = require('stream');
const finishHandler = util.promisify(finished);
const osUtils = require('../utils/os.utils');
const path = osUtils.path();

const finishedStream = spinner => async (stream, text) => {
  await finishHandler(stream);
  if (isTruthy(spinner)) {
    spinner.succeed(text);
  }
};

const tempPath = path.join(__dirname, '..', '..', 'build', 'tmp', '/');

module.exports = {finishedStream, tempPath};
