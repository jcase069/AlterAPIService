var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../../app/models/user.server.model.js');

module.exports = function() {
  passport.use(new LocalStrategy(function(username, password, done) {
    User.getByName(username, function(err, val) {
      if (err) {
        return done(err);
      }
      if (!val) {
        return done(null, false, {message: 'Unknown user'});
      }
      // TODO: authenticate user
      //if (!User.authenticate(val, password)) {
      //  return done(null, false, {message: 'Invalid password'});
      //}
      return done(null, val);
    });
  }));
};
