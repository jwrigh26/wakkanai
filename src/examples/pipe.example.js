const fs = require('fs');
const path = require('path');

const createPath = file => path.join(__dirname, '..', 'assets', file);

const options = {
  encoding: 'utf8',
  highWaterMark: 1 * 1024,
};

const pipeHappyFile = async () => {
  const readable = fs.createReadStream(createPath('happylorem.txt'), options);
  const writable = fs.createWriteStream(createPath('scratch.txt'), options);

  readable.pipe(writable);

  readable.on('end', () => {
    console.log('### Pipe Happy File -- DONE ###');
  });
};

module.exports = {pipeHappyFile};
