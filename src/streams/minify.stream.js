const {makePathUnixFriendly} = require('../utils/string.utils');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminWebp = require('imagemin-webp');
const {Transform} = require('stream');
const osUtils = require('../utils/os.utils');
const {imageType} = require('../constants');
const path = osUtils.path();

const minimizeStream = (dirPath, tempPath, protocol) => {
  return new Transform({
    transform(chunk, encoding, callback) {
      const file = chunk.toString();
      const imagePath = makePathUnixFriendly(path.join(dirPath, file));
      const use = {
        [imageType.jpg]: imageminMozjpeg({progressive: true, quality: 60}),
        [imageType.webp]: imageminWebp({quality: 60}),
      };

      imagemin([imagePath], tempPath, {
        use: [use[protocol]],
      })
        .then(() => {
          this.push(file);
          callback();
        })
        .catch(err => {
          console.log('Min blew up', err, encoding);
          callback(err);
        });
    },
  });
};

module.exports = minimizeStream;
