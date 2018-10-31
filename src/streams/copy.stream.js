const fs = require('fs');
const osUtils = require('../utils/os.utils');
const {Transform} = require('stream');
const path = osUtils.path();
const util = require('util');

const dirExists = util.promisify(fs.exists);
const makeDir = util.promisify(fs.mkdir);
const copy = util.promisify(fs.copyFile);

const createNewDir = async dirPath => {
  const exists = await dirExists(dirPath);
  if (!exists) {
    await makeDir(dirPath);
  }
  return dirPath;
};

const createNewWebDir = async dirPath => {
  const newPath = path.join(dirPath, '/', 'web');
  return await createNewDir(newPath);
};

const copyFileStream = (dirPath, tmpPath) => {
  const oldPath = tmpPath;
  const newPath = dirPath;

  const stream = new Transform({
    transform(chunk, encoding, callback) {
      const file = chunk.toString();
      const oldFilePath = path.join(oldPath, '/', file);
      const newFilePath = path.join(newPath, '/', file);
      copy(oldFilePath, newFilePath)
        .then(() => {
          this.push(file);
          callback();
        })
        .catch(err => {
          callback(err);
        });
    },
  });

  return stream;
};

module.exports = {copyFileStream, createNewDir, createNewWebDir};
