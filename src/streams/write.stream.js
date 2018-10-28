const fs = require('fs');
const osUtils = require('../utils/os.utils');
const path = osUtils.path();

const writeOutputStream = () => {
  const createPath = file => path.join(__dirname, '..', '..', 'assets', file);
  const options = {
    encoding: 'utf8',
    highWaterMark: 8 * 1024,
  };
  return fs.createWriteStream(createPath('output.txt'), options);
};

module.exports = {writeOutputStream};
