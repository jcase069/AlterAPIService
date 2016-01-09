var fs = require('fs');
var db_file = './test.db';
var _exists = fs.existsSync(db_file);

var modeldb = require('./app/models/db/sqlite.server.model.db.js')(db_file);

module.exports=modeldb;
