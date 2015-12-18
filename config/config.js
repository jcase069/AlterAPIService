// exports only the environment-specific config.
module.exports = require('./env/'+process.env.NODE_ENV+'.env.config.js');
