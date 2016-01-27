var passport = require('passport');

module.exports = function() {
  User = require('../app/models/user.server.model.js');

  passport.serializeUser(function(user, done) {
    done(null, user.user_id);
  });

  passport.deserializeUser(function(id, done) {
    User.get(id, function(err, val) {
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
  });

  require('./strategies/local.js')();
};
