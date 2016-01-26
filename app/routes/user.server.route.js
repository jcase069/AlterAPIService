var user = require('../../app/controllers/user.server.controller.js'),
  passport = require('passport');

module.exports = function(app) {
  app.route('/signup')
    .get(user.renderSignup)
    .post(user.signup);

  app.route('/signin')
    .get(user.renderSignin)
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failureFlash: true
    }));

  app.get('/signout', user.signout);
};
