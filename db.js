var db_config;

var db2 = null;

if (process.env.VCAP_SERVICES) {
  db_config = {
    db: require('ibm_db'),
    credentials: JSON.parse(process.env.VCAP_SERVICES)['sqldb'][0].credentials,
    connectionString: "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port,
  }
} else if (process.env.ALTER_TEST) {
  console.log("Entering test mode");
  db_config = require('./sqlite.js');
  db_config.initialize();
} else {
  console.log("DB2 credentials not found\n");
}

module.exports = {};

module.exports.fetchFromDB = function(query, fetch_handler) {
    db_config.db.open(db_config.connectionString, function(err, conn) {
        if (err) {
            console.log(err);
            fetch_handler(err, undefined);
        } else {
            conn.query(query, function(err, data) {
                if (err) {
                    console.log('Error executing query: '+query);
                    fetch_handler(err, undefined);
                } else {
                    conn.close();
                    fetch_handler(err, data);
                }
            });
        }
    });
}
