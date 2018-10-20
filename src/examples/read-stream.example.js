const {fs} = require('fs');
const path = require('path');

const readHappyFile = async () => {
  const file = 'happylorem.txt';
  const stream = fs.createReadStream(path.join(__dirname, '..', 'assets', file), {
    encoding: 'utf8',
    highWaterMark: 1 * 1024,
  });

  stream.on('data', chunk => {
    console.log(chunk.length);
  });

  stream.on('end', () => {
    console.log('### Read Happy File -- DONE ###');
  });
};

module.exports = {readHappyFile};

//https://medium.freecodecamp.org/a-guide-to-responsive-images-with-ready-to-use-templates-c400bd65c433
