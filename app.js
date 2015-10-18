/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var fs = require('fs');
var db = require('ibm_db');

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var db2 = null;

if (process.env.VCAP_SERVICES == null) {
  process.env.VCAP_SERVICES = '{   "sqldb": [      {         "name": "AlterAPISQLDatabase",         "label": "sqldb",         "plan": "sqldb_free",         "credentials": {            "port": 50000,            "db": "SQLDB",            "username": "user09490",            "host": "75.126.155.153",            "hostname": "75.126.155.153",            "jdbcurl": "jdbc:db2://75.126.155.153:50000/SQLDB",            "uri": "db2://user09490:p1mvA1wffvDx@75.126.155.153:50000/SQLDB",            "password": "p1mvA1wffvDx"         }      }   ]}';
}

if (process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  db2 = env['sqldb'][0].credentials;
}
else {
  console.log("DB2 credentials not found\n");
}

var dbConnection = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

function fetchFromDB(query, fetch_handler) {
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

var builder = require('xmlbuilder');

function generateFeed(categories, entries) {
    var doc = builder.create('rss', {'version': '1.0', 'encoding': 'UTF-8'}).att('xmlns:k', 'http://kinetise.com');
    var channel = doc.ele('channel');

    for (var i = 0; i < categories.length; ++i) {
        var item = channel.ele('item', {'k:context': 'cat_' + categories[i].CATEGORY_ID });
        item.ele('type', {}, 'Category');
        item.ele('name').dat(categories[i].NAME);

        var categoryEntries = entries.filter(function(e){ return e.CATEGORY_ID === categories[i].CATEGORY_ID; });

        for (var j = 0; j < categoryEntries.length; ++j) {
            var item = channel.ele('item', {'k:context': 'ent_' + categoryEntries[j].ENTRY_ID });
            item.ele('type', {}, 'Entry');
            item.ele('name').dat(categoryEntries[j].NAME);
            item.ele('price').dat(categoryEntries[j].PRICE + ' $');

            if (categoryEntries[j].IMAGE) {
                item.ele('image', {}, categoryEntries[j].IMAGE);
            }
        }
    }

    return doc.end({ pretty: true });
}


// create a new express server
var app = express();

app.get('/static-menu/', function(req, res) {
  // the feed returning logic goes here.
  fs.readFile('alter_api_response.xml', 'utf8', function (err, data) {
    if (!err) {
      // it is important to set Content-Type properly!
      res.set('Content-Type', 'text/xml');
      res.send(data);
    }
    else {
      console.log('alter_api_feed.xml file not found!');
      res.status(500).send('Server could not provide feed!');
    }
  });
});

app.get('/menu/', function(req, res) {
    fetchFromDB('SELECT * FROM MENU_CATEGORY', function(err, data) {
        if (!err) {
            var categories = data;

            fetchFromDB('SELECT * FROM MENU_ENTRY', function(err, data) {
                if (!err) {
                    var entries = data;

                    if (!categories || !entries) {
                        handleError(err, req, res);
                    }

                    res.set('Content-Type', 'text/xml');
                    res.send(generateFeed(categories, entries));
                } else {
                    handleError(err, req, res);
                }
            });
        } else {
            handleError(err, req, res);
        }
    });
});

function handleError(err, req, res) {
    console.log('Returning status 500\n');
    res.status(500).send('Server could not provide feed!');
}

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, function() {
  console.log("server starting on " + appEnv.url+'\n');
});
