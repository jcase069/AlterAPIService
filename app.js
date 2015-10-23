/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var fs = require('fs');
var db = require('./db.js');

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
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

// Part of the AlterAPI tutorial.  Not part of dLogIt
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

// Part of the AlterAPI tutorial.  Not part of dLogIt
app.get('/menu/', function(req, res) {
    db.fetchFromDB('SELECT * FROM MENU_CATEGORY', function(err, data) {
        if (!err) {
            var categories = data;

            db.fetchFromDB('SELECT * FROM MENU_ENTRY', function(err, data) {
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

// The following lines are required to parse json in recent versions of express.
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// dLogIt entrypoint
var getMeals = function (req, res) {
  // TODO
}

// dLogIt entrypoint
var addMeal = function(req, res) {
  console.log(JSON.stringify(req.body));
  res.set('Content-Type', 'text/xml');
  res.send(JSON.stringify(req.body));
}

// dLogIt entrypoint routing
app.route('/addmeal')
  .get(getMeals)
  .post(addMeal);

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
