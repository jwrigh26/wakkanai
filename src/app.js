#!/usr/bin/env node
const {defaultInputDir, normalizeInputPath} = require('./helpers/path.service');
const {description} = require('./constants');
const {readdir, readImageFileStream} = require('./helpers/read.service');
const {transformImages, writeScratchFile} = require('./helpers/image.service');
const {readYamlFile} = require('./helpers/yaml.service');

const run = async argv => {
  const ymlDoc = await readYamlFile(argv.file);
  const path = normalizeInputPath(argv.directory);
  const fileNames = await readdir(path);
  const inStream = readImageFileStream(fileNames);
  const outStream = transformImages(fileNames, path, ymlDoc);
  const tmpStream = writeScratchFile();

  inStream.pipe(outStream).pipe(tmpStream);
  inStream.on('end', () => {
    console.log('### IMAGE TRANSFORM -- END ###');
  });
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
