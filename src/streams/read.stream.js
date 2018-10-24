const fs = require('fs');
const util = require('util');
const {isTruthy} = require('../utils/truthy.utils');
const osUtils = require('../utils/os.utils');
const {Readable} = require('stream');
const path = osUtils.path();

const asyncReaddir = util.promisify(fs.readdir);

const readImageFileStream = data => {
  if (!isTruthy(data) || data.length < 0) {
    return null;
  }

  const fileNames = [...data];
  return new Readable({
    read() {
      const file = fileNames.pop();
      if (!isTruthy(file)) {
        this.push(null);
        return;
      }
      this.push(file);
    },
  });
};

const readdir = async dirPath => {
  const options = {
    encoding: 'utf8',
    highWaterMark: 8 * 1024,
  };
  const data = await asyncReaddir(dirPath, options);
  return data;
};

const writeScratchFile = () => {
  const createPath = file => path.join(__dirname, '..', '..', 'assets', file);
  const options = {
    encoding: 'utf8',
    highWaterMark: 8 * 1024,
  };
  return fs.createWriteStream(createPath('scratch.txt'), options);
};

module.exports = {readdir, readImageFileStream, writeScratchFile};
