const fs = require('fs');
const util = require('util');
const {isTruthy} = require('../utils/truthy.utils');
const {Readable} = require('stream');

const options = {
  encoding: 'utf8',
  highWaterMark: 8 * 1024,
};

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
      }
      this.push(file);
    },
  });
};

const readdir = async path => {
  const data = await asyncReaddir(path, options);
  return data;
};

module.exports = {readdir, readImageFileStream};
