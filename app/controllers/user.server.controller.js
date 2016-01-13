var User = require("../models/user.server.model.js");

exports.create = function (req, res, next) {
  // create User
  console.log("Creating test user");
  User.add({user_name: 'TestAddUser'}, function(err, user_id) {
    if (!err) {
      res.render('index', {title: 'User created: '+user_id});
    } else {
      res.render('index', {title: 'Failed to create user'});
    }
  });
};
