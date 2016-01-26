exports.render = function(req, res) {
  req.session.lastVisit = new Date();
  res.render('index', {
    title: 'Hello World',
    userName: req.user ? req.user.user_name : ''
  });
};
