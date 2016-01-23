var
  config = require('./config'),
  express = require('express'),
  morgan = require('morgan'),
  compress = require('compression'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  passport = require('passport');

module.exports = function() {
  var app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  require('../app/models/all.server.model.js')(config.dbInit());

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  require('../app/routes/index.server.route.js')(app);
  require('../app/routes/user.server.route.js')(app);

  app.use(express.static('./public'));

  return app;
};
