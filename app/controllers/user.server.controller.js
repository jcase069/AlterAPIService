var User = require("../models/user.server.model.js");

var _validateCreateUserParams = function(user) {
  if (typeof(user.user_name) != 'string') {
    return false;
  }
  if (user.user_name.length > 16) {
    return false;
  }
  return true;
}

exports.create = function (req, res, next) {
  // create User
  console.log("Creating user");
  if (!_validateCreateUserParams(req.body)) {
    res.render('index', {title: 'Failed due to bad parameters'});
    return;
  }
  var _user = {
    user_name: req.body.user_name,
  }
  User.add(_user, function(err, user_id) {
    if (!err) {
      res.render('index', {title: 'User created: '+user_id});
    } else {
      res.render('index', {title: 'Failed to create user'});
    }
  });
};
