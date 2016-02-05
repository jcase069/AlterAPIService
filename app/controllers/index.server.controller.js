exports.render = function(req, res) {
  req.session.lastVisit = new Date();
  res.render('index', {
    title: 'Hello World',
    user: JSON.stringify(req.user),
    //userName: req.user ? req.user.user_name : ''
  });
};
