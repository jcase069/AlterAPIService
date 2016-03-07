module.exports = function(app) {
  var index = require('../controllers/index.server.controller');
  app.get('/', index.render);
  app.get('/about', function(req, res) {
    res.render('about', {
      title: 'About dLogit',
      user: JSON.stringify(req.user),
    });
  });
};
