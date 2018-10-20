const pth = require('path');

const isWindows = () => process.platform === 'win32';
const path = () => (isWindows() ? pth.win32 : pth.posix);

module.exports = {isWindows, path};
