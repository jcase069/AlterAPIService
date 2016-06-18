var users = require('../../app/controllers/user.server.controller'),
  meals = require('../../app/controllers/meals.server.controller');

module.exports = function(app) {
  app.route('/api/meals')
    .get(users.requiresLogin, meals.list)
    .post(users.requiresLogin, meals.create);

  app.route('/api/meals/:mealId')
    .get(users.requiresLogin, meals.hasAuthorization, meals.read)
    .put(users.requiresLogin, meals.hasAuthorization, meals.update)
    .delete(users.requiresLogin, meals.hasAuthorization, meals.delete);

  app.param('mealId', meals.mealById);
};
