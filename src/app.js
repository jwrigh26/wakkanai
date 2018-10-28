#!/usr/bin/env node
const {defaultInputDir, normalizeInputPath} = require('./helpers/path.service');
const {description, imageType} = require('./constants');
const {readdir, readImageFileStream} = require('./streams/read.stream');
const {writeOutputStream} = require('./streams/write.stream');
// const {readYamlFile} = require('./helpers/yaml.service');
const minimizeStream = require('./streams/minify.stream');
const sharpStream = require('./streams/sharp.stream');
const {copyFileStream, createNewDir} = require('./streams/copy.stream');
const streamHelper = require('./helpers/stream.helper');
const removeDir = require('./helpers/removeDir');
const Ora = require('ora');

const spinner = new Ora({
  color: 'white',
  text: 'running',
});

const cleanup = tmpPath => async () => {
  await removeDir(tmpPath);
  spinner.succeed('Tmp directory cleaned');
};

const copyImages = (dirPath, tmpPath) => async () => {
  const newDirPath = await createNewDir(dirPath);
  const fileNames = await readdir(tmpPath);
  const readStrm = readImageFileStream(fileNames);
  const copyStrm = copyFileStream(newDirPath, tmpPath);
  const writeStrm = writeOutputStream();
  const handleFinish = streamHelper.handleFinish(spinner);
  const handleError = streamHelper.handleError;

  copyStrm.on('error', handleError);
  writeStrm.on('error', handleError);

  handleFinish(copyStrm, 'copyImages to ouput directory finished');
  handleFinish(writeStrm, 'Wakkanai has finished running!', cleanup(tmpPath));
  readStrm.pipe(copyStrm).pipe(writeStrm);
};

const processImages = async argv => {
  // const ymlDoc = await readYamlFile(argv.file);
  const dirPath = normalizeInputPath(argv.directory);
  const tmpPath = streamHelper.tempPath;
  const fileNames = await readdir(dirPath);
  const readStrm = readImageFileStream(fileNames);
  const minJpegStrm = minimizeStream(dirPath, tmpPath, imageType.jpg);
  const minWebpStrm = minimizeStream(dirPath, tmpPath, imageType.webp);
  const sharpJpegpStrm = sharpStream(tmpPath, imageType.jpg);
  const sharpWebpStrm = sharpStream(tmpPath, imageType.webp);
  const writeStrm = writeOutputStream();
  const handleFinish = streamHelper.handleFinish(spinner);
  const handleError = streamHelper.handleError;

  spinner.start();

  minJpegStrm.on('error', handleError);
  minWebpStrm.on('error', handleError);
  sharpJpegpStrm.on('error', handleError);
  sharpWebpStrm.on('error', handleError);

  handleFinish(minJpegStrm, 'minify Jpegs finished');
  handleFinish(minWebpStrm, 'minify Webps finished');
  handleFinish(sharpJpegpStrm, 'sharp Jpegs finished');
  handleFinish(sharpWebpStrm, 'sharp Webps finished');
  handleFinish(writeStrm, 'Image processing complete', copyImages(dirPath, tmpPath));

  readStrm
    .pipe(minJpegStrm)
    .pipe(minWebpStrm)
    .pipe(sharpJpegpStrm)
    .pipe(sharpWebpStrm)
    .pipe(writeStrm);
};

module.exports = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .alias('f', 'file')
  .alias('d', 'directory')
  .alias('h', 'help')
  .describe('f', description.file)
  .describe('d', description.directory)
  .command(
    'run',
    description.run,
    yargs => {
      // Run command options
      return yargs.options({
        file: {alias: 'f', default: 'images.yml'},
        directory: {alias: 'd', default: defaultInputDir()},
      });
    },
    processImages
  )
  .help().argv;
