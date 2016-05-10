module.exports = function(db_file) {

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

  var toReturn = {};

  toReturn.initialize = function (handler) {
    db.serialize(function() {
      if (!_exists) {
        //_executeCommandFromFile('./sql/CreateTables.sql');
      }
      db.run("PRAGMA foreign_keys = ON;", dbCallback('foreign_keys Pragma'));
    });
    handler(_err);
  };

  toReturn.listBloodSugars = function(user_id, handler) {
    db.all("SELECT blood_sugar_id, measurement, measurement_time FROM blood_sugar WHERE user_id=$user_id;",
      {$user_id: user_id}, handler);
  }

  toReturn.getBloodSugar = function(user_id, blood_sugar_id, handler) {
    db.get("SELECT blood_sugar_id, measurement, measurement_time FROM blood_sugar WHERE user_id=$user_id AND blood_sugar_id=$blood_sugar_id;",
      {$user_id: user_id, $blood_sugar_id: blood_sugar_id},
      handler);
  }

  toReturn.addBloodSugar = function(user_id, measurement, handler) {
    db.serialize(function() {
      db.run("INSERT INTO blood_sugar (user_id, measurement, measurement_time) VALUES ($user_id, $measurement, current_timestamp)",
        {$user_id: user_id, $measurement: measurement},
        dbCallback('addBloodSugar insert')
      );
      db.get("SELECT last_insert_rowid();", function(err, obj) {
        handler(err, obj['last_insert_rowid()']);
      });
    });
  }

  toReturn.updateBloodSugar = function(user_id, blood_sugar, handler) {
    db.run("UPDATE blood_sugar SET measurement=$measurement, measurement_time=$measurement_time WHERE blood_sugar_id=$blood_sugar_id AND user_id=$user_id",
      {
        $measurement: blood_sugar.measurement,
        $measurement_time: blood_sugar.measurement_time,
        $blood_sugar_id: blood_sugar.blood_sugar_id,
        $user_id: user_id
      },
      handler
    );
  }

  toReturn.deleteBloodSugar = function(user_id, blood_sugar_id, handler) {
    db.run('DELETE FROM blood_sugar WHERE user_id=$user_id AND blood_sugar_id=$blood_sugar_id',
      {$user_id: user_id, $blood_sugar_id: blood_sugar_id},
      handler
    );
  }

  toReturn.listMeals = function(user_id, handler) {
    db.all("SELECT meal_ID, meal_time, est_carbs FROM meals WHERE user_id=$user_id;",
      {$user_id: user_id}, handler);
  };

  toReturn.getMeal = function(user_id, meal_id, handler) {
    db.get("SELECT meal_time, est_carbs, meal_ID FROM meals WHERE user_id=$user_id AND meal_ID=$meal_id;",
      {$user_id: user_id, $meal_id: meal_id},
      handler);
  };

  toReturn.addMeal = function (user_id, meal, handler) {
    // handler function takes (err, data), but no data will be returned by this function.
    db.serialize(function() {
      db.run("INSERT INTO meals (user_id, meal_time, est_carbs) VALUES ($user_id, current_timestamp, $est_carbs);",
        {$user_id: user_id, $est_carbs: meal.est_carbs},
        dbCallback('addMeal insert')
      );
      db.get("SELECT last_insert_rowid();", function(err, obj) {handler(err, obj['last_insert_rowid()']);});
    });
  };

  toReturn.updateMeal = function (user_id, meal, handler) {
    db.run("UPDATE meals SET meal_time=$meal_time, est_carbs=$est_carbs WHERE meal_ID=$meal_id AND user_id=$user_id",
      {
        $meal_time: meal.meal_time,
        $est_carbs: meal.est_carbs,
        $meal_id: meal.meal_ID,
        $user_id: user_id
      },
      handler);
  };

  toReturn.deleteMeal = function (user_id, meal_id, handler) {
    db.run("DELETE FROM meals WHERE user_id=$user_id AND meal_id=$meal_id",
      {$user_id: user_id, $meal_id: meal_id},
      handler);
  };

  toReturn.addUser = function (user, handler) {
    db.serialize(function() {
      db.run("INSERT INTO users (user_name, password_digest, salt) VALUES ($user_name, $password_digest, $salt);",
        {$user_name: user.user_name, $password_digest: user.password_digest, $salt: user.salt},
        dbCallback('addUser insert')
      );
      db.get("SELECT last_insert_rowid();", function(err, obj) {handler(err, obj['last_insert_rowid()']);});
    });
  };

  toReturn.getUser = function (user_id, handler) {
    db.serialize(function() {
      db.get("SELECT user_id, user_name FROM users WHERE user_id=$user_id",
        {$user_id: user_id},
        handler
      );
    });
  }

  toReturn.getUserByName = function (user_name, handler) {
    db.serialize(function() {
      db.get("SELECT user_id, user_name FROM users WHERE user_name=$user_name",
        {$user_name: user_name},
        handler
      );
    })
  }

  toReturn.listUsers = function (handler) {
    db.serialize(function() {
      db.all("SELECT user_id, user_name FROM users", handler);
    })
  }

  toReturn.updateUser = function(user, handler) {
    db.serialize(function() {
      db.run("UPDATE users SET user_name=$user_name WHERE user_id=$user_id",
        {$user_name: user.user_name, $user_id: user.user_id},
        handler
      );
    })
  }

  toReturn.updateUserPassword = function(user_id, password_digest, salt, handler) {
    db.run("UPDATE users SET password_digest=$password_digest, salt=$salt WHERE user_id=$user_id",
      {$user_id: user_id, $salt: salt, $password_digest: password_digest},
      handler
    )
  }

  toReturn.deleteUser = function (user_id, handler) {
    db.serialize(function() {
      db.run("DELETE FROM users WHERE user_id=$user_id", {$user_id: user_id}, handler);
    });
  }

  toReturn.close = function(handler) {
    db.close();
    handler();
  }

  return toReturn;

};
