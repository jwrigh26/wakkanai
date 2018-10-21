const fs = require('fs');
const util = require('util');
const yaml = require('js-yaml');
const osUtils = require('../utils/os.utils');
const path = osUtils.path();

const createPath = file => path.join(__dirname, '..', 'scripts', file);

const options = {
  encoding: 'utf8',
  highWaterMark: 8 * 1024,
};

const readFile = util.promisify(fs.readFile);

const readYamlFile = async file => {
  try {
    const doc = await readFile(createPath(file), options);
    return yaml.safeLoad(doc);
  } catch (err) {
    console.log('Cannot read file: ', file);
    console.log('__dirname', __dirname);
    console.error(err);
  }
  return null;
};

module.exports = {readYamlFile};
