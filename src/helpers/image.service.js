const fs = require('fs');
const compressImages = require('compress-images');
const {isTruthy} = require('../utils/truthy.utils');
const {makePathUnixFriendly} = require('../utils/string.utils');
const {Transform} = require('stream');
const osUtils = require('../utils/os.utils');
const path = osUtils.path();

const compress = (file, url) => {
  const createPath = () => path.join(__dirname, '..', '..', 'build', 'compressed', '/');
  const imagPath = makePathUnixFriendly(url);
  const options = {['compress_force']: false, statistic: true, autoupdate: true};
  const globalOption = false;
  const engines = [
    {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
    {png: {engine: 'pngquant', command: ['--quality=20-50']}},
    {svg: {engine: 'svgo', command: '--multipass'}},
    {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}},
  ];

  compressImages(imagPath, createPath(), options, globalOption, ...engines, (err, completed) => {
    console.log('err', err, 'completed', completed);
  });
};

const transformImages = (data, dirPath, ymlDoc) => {
  if (!isTruthy(data) || data.length < 0) {
    return null;
  }

  return new Transform({
    transform(chunk, encoding, callback) {
      const file = chunk.toString();
      const url = path.join(dirPath, file);
      compress(file, url);
      this.push(url);
      callback();
    },
  });
};

const writeScratchFile = () => {
  const createPath = file => path.join(__dirname, '..', '..', 'assets', file);
  const options = {
    encoding: 'utf8',
    highWaterMark: 8 * 1024,
  };
  return fs.createWriteStream(createPath('scratch.txt'), options);
};

module.exports = {transformImages, writeScratchFile};
