var db = require('ibm_db');

var db2 = null;

if (process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  db2 = env['sqldb'][0].credentials;
}
else {
  console.log("DB2 credentials not found\n");
}

var dbConnection = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

module.exports = {};

module.exports.fetchFromDB = function(query, fetch_handler) {
    db.open(dbConnection, function(err, conn) {
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
