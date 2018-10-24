const {makePathUnixFriendly} = require('../utils/string.utils');
const sharp = require('sharp');
const {Transform} = require('stream');
const osUtils = require('../utils/os.utils');
const path = osUtils.path();

const imageSizes = [1400, 900, 600];

const sharpStream = (tempPath, protocol) => {
  const filterSizes = (metaData, sizes) => {
    return sizes.filter(size => size <= metaData.width);
  };

  const resize = async (imagePath, name, extension, callback) => {
    const meta = await sharp(imagePath).metadata();
    try {
      await Promise.all(
        filterSizes(meta, imageSizes).map(async size => {
          const file = path.join(tempPath, `${name}_${size}.${extension}`);
          await sharp(imagePath)
            .resize(size)
            .toFile(file);
        })
      );
      callback(null);
    } catch (err) {
      callback(err);
    }
  };

  return new Transform({
    transform(chunk, encoding, callback) {
      const file = chunk.toString();
      const name = path.parse(file).name;
      const imagePath = makePathUnixFriendly(path.join(tempPath, `${name}.${protocol}`));

      resize(imagePath, name, protocol, err => {
        if (err) {
          console.log('Sharp blew up', err, encoding);
          throw err;
        }
        console.log('Completed resizeing for ', name, protocol);
        this.push(file);
        callback();
      });
    },
  });
};

module.exports = sharpStream;
