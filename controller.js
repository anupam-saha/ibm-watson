const service = require('./service');

exports.ask = (message) => {
  return service.getMessage(message)
   
};