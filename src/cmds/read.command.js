const fs = require('fs');
const yaml = require('js-yaml');
const osUtils = require('../utils/os.utils');
const strUtils = require('../utils/string.utils');
const {error} = require('../constants');

const path = osUtils.path();

const defaultInputDir = () => {
  const dir = path.parse(process.cwd());
  return dir;
};

const createPath = file => path.join(__dirname, file);

const options = {
  encoding: 'utf8',
  highWaterMark: 1 * 1024,
};

const readYaml = file => {
  try {
    const doc = fs.readFileSync(createPath(file), options);
    return yaml.safeLoad(doc);
  } catch (err) {
    console.log('Cannot read file: ', file);
    console.error(err);
  }
  return null;
};

const parseDir = dir => {
  if (strUtils.hasBackslashes(dir)) {
    throw error.badDirectory;
  }
  const n = path.parse(path.normalize(dir));
  // const p = path.parse(n);
  return n;
};

const readImageInputDir = dir => {
  const isString = strUtils.isString(dir);
  const hasBs = strUtils.hasBackslashes(dir);

  try {
    const parsedDir = parseDir(dir);
    console.log('PARSED', parsedDir);
  } catch (err) {
    console.log('Boo!');
    console.error(err);
  }

  // const n = path.normalize(dir);

  // if (strUtils.isString(dir)) {
  //   console.log('Is String', dir);
  // }

  // console.log(t);
  // const d = strUtils.isString(dir) ? parseDir(dir) : dir;
  // console.log('d', d, path.sep);

  // try {
  //   console.log('DIR DEFAULT', dir);
  //   // const readable = fs.createReadStream()
  //   // console.log(__dirname);
  //   // console.log('DIR', path.parse(process.cwd()));
  // } catch (err) {
  //   console.log('Boo!');
  //   console.error(err);
  // }
};

module.exports = {defaultInputDir, readImageInputDir, readYaml};
