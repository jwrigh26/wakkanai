const error = {
  badDirectory: String.raw`Use "\\" or "/" as the directory segement separator. 
  Do not use just a "\" on Window machines. It won't work.`,
};

const description = {
  directory: String.raw`Points to the directory of images to process. 
  Use "\\" or "/" as the directory segement separator. 
  Do not use just a "\" on Window machines. It won't work.`,
  file: 'Points to the yaml file to run.',
  run: 'Run local yaml file to do magic with images.',
};

module.exports = {description, error};
