var user = require('../../app/controllers/user.server.controller.js');

module.exports = function(app) {
  app.route('/user').post(user.create);
}
