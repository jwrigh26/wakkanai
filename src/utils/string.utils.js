const truthy = require('./truthy.utils');

const isString = str => {
  return truthy.isTruthy(str) && typeof str === 'string';
};

const hasBackslashes = str => {
  const regex1 = /\\/;
  const regex2 = /\//;
  return str.search(regex1) > -1 || str.search(regex2) > -1 ? false : true;
};

const makePathUnixFriendly = str => {
  return str.replace(/\\/g, '/');
};

module.exports = {hasBackslashes, isString, makePathUnixFriendly};
