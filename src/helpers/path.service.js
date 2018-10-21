const fs = require('fs');
const osUtils = require('../utils/os.utils');
const strUtils = require('../utils/string.utils');
const {error} = require('../constants');

const path = osUtils.path();

const defaultInputDir = () => {
  const dir = path.normalize(process.cwd());
  return path.join(dir, 'assets', 'raw');
};

const normalizeInputPath = str => {
  try {
    if (!strUtils.isString(str)) {
      throw error.notString;
    }
    if (strUtils.hasBackslashes(str)) {
      throw error.badPath;
    }
    const imagePath = path.normalize(str);

    if (!fs.lstatSync(imagePath).isDirectory()) {
      throw error.badDirectory;
    }

    return imagePath;
  } catch (err) {
    console.log('Boo!');
    console.error(err);
  }
  return null;
};

module.exports = {defaultInputDir, normalizeInputPath};
