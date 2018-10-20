const fs = require('fs');
const path = require('path');
const util = require('util');
const greet = fs.readdirSync(path.join(__dirname, '..', 'assets'), 'utf8');
console.log('greet', greet);

const readFile = util.promisify(fs.readFile);

const data = async () => {
  return await readFile(path.join(__dirname, '..', 'assets', 'helloworld.txt'), 'utf8');
};

const run = async () => {
  try {
    const response = await data();
    console.log('Main', response);
  } catch (err) {
    console.warn('ERROR HAPPENED');
    console.warn(err);
  }
};

run();
