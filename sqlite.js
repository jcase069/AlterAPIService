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

var _err = null;
var dbCallback = function(desc) {
  return function (err) {
    if (err) {
      _err = err;
      console.log('Error in sqlite, '+desc+': '+_err);
      throw err;
    }
  };
}

module.exports = {};

module.exports.initialize = function (handler) {
  db.serialize(function() {
    if (!_exists) {
      //_executeCommandFromFile('./sql/CreateTables.sql');
    }
    db.run("PRAGMA foreign_keys = ON;", dbCallback('foreign_keys Pragma'));
  });
  handler(_err);
};

module.exports.listMeals = function(user_id, handler) {
  db.all("SELECT meal_ID, meal_time, est_carbs FROM meals WHERE user_id=$user_id;",
    {$user_id: user_id}, handler);
};

module.exports.getMeal = function(user_id, meal_id, handler) {
  db.get("SELECT meal_time, est_carbs FROM meals WHERE user_id=$user_id AND meal_ID=$meal_id;",
    {$user_id: user_id, $meal_id: meal_id},
    handler);
};

module.exports.addMeal = function (user_id, meal, handler) {
  // handler function takes (err, data), but no data will be returned by this function.
  db.serialize(function() {
    db.run("INSERT INTO meals (user_id, meal_time, est_carbs) VALUES ($user_id, current_timestamp, $est_carbs);",
      {$user_id: user_id, $est_carbs: meal.est_carbs},
      dbCallback('addMeal insert')
    );
    db.get("SELECT last_insert_rowid();", function(err, obj) {handler(err, obj['last_insert_rowid()']);});
  });
};

module.exports.updateMeal = function (user_id, meal, handler) {
  db.run("UPDATE meals SET meal_time=$meal_time, est_carbs=$est_carbs WHERE meal_ID=$meal_id AND user_id=$user_id",
    {
      $meal_time: meal.meal_time,
      $est_carbs: meal.est_carbs,
      $meal_id: meal.meal_ID,
      $user_id: user_id
    },
    handler);
};

module.exports.deleteMeal = function (user_id, meal_id, handler) {
  db.run("DELETE FROM meals WHERE user_id=$user_id AND meal_id=$meal_id",
    {$user_id: user_id, $meal_id: meal_id},
    handler);
};

module.exports.addUser = function (user, handler) {
  db.serialize(function() {
    db.run("INSERT INTO users (user_name) VALUES ($user_name);",
      {$user_name: user.user_name},
      dbCallback('addUser insert')
    );
    db.get("SELECT last_insert_rowid();", function(err, obj) {handler(err, obj['last_insert_rowid()']);});
  });
};

module.exports.getUser = function (user_id, handler) {
  db.serialize(function() {
    db.get("SELECT * FROM users WHERE user_id=$user_id",
      {$user_id: user_id},
      handler
    );
  });
}

module.exports.listUsers = function (handler) {
  db.serialize(function() {
    db.all("SELECT user_id, user_name FROM users", handler);
  })
}

module.exports.updateUser = function(user, handler) {
  db.serialize(function() {
    db.run("UPDATE users SET user_name=$user_name WHERE user_id=$user_id",
      {$user_name: user.user_name, $user_id: user.user_id},
      handler
    );
  })
}

module.exports.deleteUser = function (user_id, handler) {
  db.serialize(function() {
    db.run("DELETE FROM users WHERE user_id=$user_id", {$user_id: user_id}, handler);
  });
}

module.exports.close = function(handler) {
  db.close();
  handler();
}
