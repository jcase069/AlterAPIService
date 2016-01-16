var _User = require('./user.server.model.js');
var _Meal = require('./meal.server.model.js');
var _BloodSugar = require('./bloodSugar.server.model.js');

module.exports = function(db) {
  _User.init(db);
  _Meal.init(db);
  _BloodSugar.init(db);
  return {
    User: _User,
    Meal: _Meal,
    BloodSugar: _BloodSugar,
  }
}
