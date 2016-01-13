var _User = require('./user.server.model.js');

module.exports = function(db) {
  _User.init(db);
  return {
    User: _User
  }
}
