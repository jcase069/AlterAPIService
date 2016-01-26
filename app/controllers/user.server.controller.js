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

exports.signup = function (req, res, next) {
  // create User
  console.log("Creating user");
  if (!_validateCreateUserParams(req.body)) {
    req.flash('error', 'Failed due to bad parameters')
    return res.redirect('/signup');
  }
  var _salt = User.generateSalt();
  console.log("salt: "+_salt);
  console.log("password: "+req.body.password);
  var _user = {
    user_name: req.body.user_name,
    salt: _salt,
    password_digest: User.hashPassword(req.body.password, _salt),
  }
  User.add(_user, function(err, user_id) {
    if (err) {
      var message = 'Failed to create user';
      req.flash('error', message);
      return res.redirect('/signup');
    }
    else {
      delete _user.password_digest;
      delete _user.salt;
      req.login(_user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
    }
  });
};

exports.renderSignin = function(req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title: 'Sign-in Form',
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  };
}

exports.renderSignup = function(req, res, next) {
  if (!req.user) {
    res.render('signup', {
      title: 'Sign-up Form',
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/');
  }
};

exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};
