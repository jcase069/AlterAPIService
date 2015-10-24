var fs = require('fs');
var db_file = './test.db';
var _exists = fs.existsSync(db_file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(db_file);

var _readCommand = function(filename, success) {
  fs.readFile(filename, 'utf8', function(err, commandString) {
    if (err) {
      console.log('Error loading CreateTables.sql ' + err);
      return;
    }
    success(commandString);
  });
};

var _executeCommandFromFile = function(filename) {
  _readCommand(filename, function(commandString) {
    console.log('Executing:\n'+commandString);
    debugger;
    db.run(commandString);
  })
};

module.exports = {};

module.exports.initialize = function () {
  db.serialize(function() {
    if (!_exists) {
      //_executeCommandFromFile('./sql/CreateTables.sql');
    }
  });
}

module.exports.addMeal = function (meal, handler) {
  // handler function takes (err, data), but no data will be returned by this function.
  var stmt = db.prepare("INSERT INTO meals (meal_time, est_carbs) VALUES (current_timestamp, ?);");
  stmt.run(meal.est_carbs);
  stmt.finalize();
  handler(null);
}
