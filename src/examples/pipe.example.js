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

// compress-images
// const compressImage = (file, url, callback) => {
//   const createPath = () => path.join(__dirname, '..', '..', 'build', 'compressed', '/');
//   const imagPath = makePathUnixFriendly(url);
//   const options = {['compress_force']: false, statistic: false, autoupdate: true};
//   const globalOption = false;
//   const engines = [
//     {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
//     {png: {engine: 'pngquant', command: ['--quality=20-50']}},
//     {svg: {engine: 'svgo', command: '--multipass'}},
//     {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}},
//   ];

//   compressImages(imagPath, createPath(), options, globalOption, ...engines, callback);
// };

// const compressStream = dirPath => {
//   return new Transform({
//     transform(chunk, encoding, callback) {
//       const file = chunk.toString();
//       const url = path.join(dirPath, file);

//       compressImage(file, url, err => {
//         if (isTruthy(err)) {
//           throw err;
//         }

//         this.push(file);
//         callback();
//       });
//     },
//   });
// };

// class StreamError extends Error {}

// const imageConvertStream = () => {
//   return new Transform({
//     transform(chunk, encoding, callback) {
//       const file = chunk.toString();
//       const imagePath = makePathUnixFriendly(path.join(imageMinBuildPath, file));
//       const outputPath = makePathUnixFriendly(path.join(imageConvertBuildPath, file + '.webp'));
//       // webp.cwebp(imagePath, outputPath, '-q 80', status => {
//       //   if (status === '100') {
//       //     this.push(file);
//       //     callback();
//       //     return;
//       //   }

//       //   console.log('Webp passed by if statement', status);
//       //   // const msg = `Webp conversion blew up. Status: ${status}`;
//       //   // throw new StreamError(msg);
//       // });
//     },
//   });
// };

// const resizerStream = () => {
//   return new Transform({
//     transform(chunk, encoding, callback) {
//       const file = chunk.toString();
//       const imagePath = makePathUnixFriendly(path.join(imageMinBuildPath, file));
//       resizer(imagePath, resizeSetup)
//         .then(() => {
//           this.push(file);
//           callback();
//         })
//         .catch(err => {
//           console.log('Resize blew up', err, encoding);
//           throw err;
//         });
//     },
//   });
// };

// const resizeSetup = {
//   all: {
//     path: imageResizeBuildPath,
//     quality: 60,
//   },
//   versions: [
//     {
//       prefix: 'big_',
//       width: 1024,
//       height: 1024,
//     },
//     {
//       prefix: 'medium_',
//       width: 512,
//       height: 512,
//     },
//     {
//       prefix: 'small_',
//       width: 128,
//       height: 128,
//     },
//   ],
// };
//  const resizer = require('node-image-resizer');
