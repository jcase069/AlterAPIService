module.exports = function(app) {
  app.get('/about', function(req, res) {
    res.render('about', {
      title: 'About dLogit',
      user: JSON.stringify(req.user),
    });
  });
};
