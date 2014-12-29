var Service = require('./service'), fs = require('fs');

require('util').inherits(c, Service);

function c(init) {
  this.opts = {
    validateAll: true
  };
  Service.call(this, init);
}

c.prototype.frontError = function frontError(c) {
  var data = c.req.body;

  fs.appendFile('./log/front_error.log', JSON.stringify(data, null, '\t'));
};

module.exports = ErrorController = c;
