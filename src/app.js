#!/usr/bin/env node
const {defaultInputDir, normalizeInputPath} = require('./helpers/path.service');
const {description, imageType} = require('./constants');
const {readdir, readImageFileStream, writeScratchFile} = require('./streams/read.stream');
const {readYamlFile} = require('./helpers/yaml.service');
const minimizeStream = require('./streams/minify.stream');
const sharpStream = require('./streams/sharp.stream');
const streamHelper = require('./helpers/stream.helper');
const Ora = require('ora');

const spinner = new Ora({
  color: 'white',
  text: 'starting ',
});

const run = async argv => {
  const ymlDoc = await readYamlFile(argv.file);
  const dirPath = normalizeInputPath(argv.directory);
  const tmpPath = streamHelper.tempPath;
  const fileNames = await readdir(dirPath);
  const readStrm = readImageFileStream(fileNames);
  const minJpegStrm = minimizeStream(dirPath, tmpPath, imageType.jpg);
  const minWebpStrm = minimizeStream(dirPath, tmpPath, imageType.webp);
  const sharpJpegpStrm = sharpStream(tmpPath, imageType.jpg);
  const sharpWebpStrm = sharpStream(tmpPath, imageType.webp);
  const tmpStrm = writeScratchFile();
  const finish = streamHelper.finishedStream(spinner);

  spinner.start();

  finish(minJpegStrm, 'minify Jpegs finished');
  finish(minWebpStrm, 'minify Webps finished');
  finish(sharpJpegpStrm, 'sharp Jpegs finished');
  finish(sharpWebpStrm, 'sharp Webps finished');
  finish(tmpStrm, 'Image Magic done');

  try {
    readStrm
      .pipe(minJpegStrm)
      .pipe(minWebpStrm)
      .pipe(sharpJpegpStrm)
      .pipe(sharpWebpStrm)
      .pipe(tmpStrm);
  } catch (err) {
    spinner.fail('Something bad happened');
    console.error(err);
  }
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
    run
  )
  .help().argv;
