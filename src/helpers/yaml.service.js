const fs = require('fs');
const yaml = require('js-yaml');
const {createPath, readOptions} = require('../utils/stream.utils');

const readYaml = file => {
  try {
    const doc = fs.readFileSync(createPath(file), readOptions);
    return yaml.safeLoad(doc);
  } catch (err) {
    console.log('Cannot read file: ', file);
    console.error(err);
  }
  return null;
};

module.exports = {readYaml};
