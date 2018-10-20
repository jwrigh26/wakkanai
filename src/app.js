#!/usr/bin/env node
const {defaultInputDir, normalizeInputPath} = require('./helpers/path.service');
const {description} = require('./constants');

const run = argv => {
  // const doc = cmd.readYaml(argv.file);
  // C:\Users\jwright\Pictures\images
  // console.log('argvs', argv);
  const path = normalizeInputPath(argv.directory);
  console.log('PATH', path);
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
