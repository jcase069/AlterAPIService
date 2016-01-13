module.exports = {
  sessionSecret: 'awkwardBehaviorSwallowsTheStar',
  dbInit: function() {
    // local sqlite3 db
    var fs = require('fs');
    var db_file = './test.db';
    return require('../../app/models/db/sqlite.server.model.db.js')(db_file);
  }
};
