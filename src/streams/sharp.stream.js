const {makePathUnixFriendly} = require('../utils/string.utils');
const sharp = require('sharp');
const {Transform} = require('stream');
const osUtils = require('../utils/os.utils');
const path = osUtils.path();

const imageSizes = [
  {name: 'sm', suffix: '_1x', quality: 60, width: 600},
  {name: 'sm', suffix: '_2x', quality: 60, width: 1200},
  {name: 'md', suffix: '_1x', quality: 60, width: 900},
  {name: 'md', suffix: '_2x', quality: 60, width: 1800},
  {name: 'lg', suffix: '_1x', quality: 60, width: 1440},
  {name: 'lg', suffix: '_2x', quality: 60, width: 2880},
];

const sharpStream = (tempPath, protocol) => {
  const filterSizes = (metaData, sizes) => {
    return sizes.filter(size => size.width <= metaData.width);
  };

  const resize = async (imagePath, name, extension, callback) => {
    const meta = await sharp(imagePath).metadata();
    try {
      await Promise.all(
        filterSizes(meta, imageSizes).map(async e => {
          const img = `${name}-${e.name}_${e.suffix}`;
          const file = path.join(tempPath, `${name}_${img}.${extension}`);
          await sharp(imagePath)
            .resize(e.width)
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

        this.push(file);
        callback();
      });
    },
  });
};

module.exports = sharpStream;
