var users = require('../../app/controllers/user.server.controller'),
  bloodSugars = require('../../app/controllers/blood-sugars.server.controller');

module.exports = function(app) {
  app.route('/api/blood-sugars')
    .get(users.requiresLogin, bloodSugars.list)
    .post(users.requiresLogin, bloodSugars.create);

  app.route('/api/blood-sugars/:bloodSugarId')
    .get(users.requiresLogin, bloodSugars.hasAuthorization, bloodSugars.read)
    .put(users.requiresLogin, bloodSugars.hasAuthorization, bloodSugars.update)
    .delete(users.requiresLogin, bloodSugars.hasAuthorization, bloodSugars.delete);

  app.param('bloodSugarId', bloodSugars.bloodSugarById);
};
