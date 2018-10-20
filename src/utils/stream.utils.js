const osUtils = require('../utils/os.utils');

const path = osUtils.path();

const createPath = file => path.join(__dirname, file);

const readOptions = {
  encoding: 'utf8',
  highWaterMark: 1 * 1024,
};

module.exports = {createPath, readOptions};
