const error = {
  badDirectory: 'The provided path is not a directory. Please provide the path to a directory.',
  badPath: String.raw`Use "\\" or "/" as the path segement separator. 
  Do not use just a "\" on Window machines. It won't work.`,
  notString: 'The provided parameter must be of type string.',
};

const description = {
  directory: String.raw`Points to the absolute directory path of images to process. 
  Use "\\" or "/" as the directory segement separator. 
  Do not use just a "\" on Window machines. It won't work.`,
  file: 'Points to the yaml file to run.',
  run: 'Run local yaml file to do magic with images.',
};

const imageType = {
  jpg: 'jpg',
  webp: 'webp',
};

module.exports = {description, error, imageType};
