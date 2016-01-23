// Default to development.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express.js');
var passport = require('./config/passport.js');

var app = express();
var passport = passport();

app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000/');
