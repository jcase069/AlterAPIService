var sqlite = require('./sqlite.js'),
  async = require('async');

// verificationFunction(results) returns null on success, string describing failure otherwise
function compileTestResult(err, results, testName, verificationFunction) {
  if (err) {
    console.log('Error ' + err);
    throw 'Error ' + err;
  } else {
    var verification = verificationFunction(results);
    if (verification == null) {
      console.log('Passed ' + testName);
    } else {
      throw 'Failed '+testName+': '+verification;
    }
  }
}

var testBloodSugarCrud = function(callback) {
  var user_id, blood_sugar_id;
  async.series([
    // 0. Create a user for testing
    function(callback) {
      sqlite.addUser({user_name: 'Test User Blood Sugar'}, function(err, val) {
        user_id = val;
        callback(err, val);
      });
    },
    // 1. Create a blood sugar measurement
    function(callback) {
      sqlite.addBloodSugar(user_id, 42, function(err, val) {
        blood_sugar_id = val;
        callback(err, val);
      });
    },
    // 2. Get the meal measurement
    function(callback) {
      sqlite.getBloodSugar(user_id, blood_sugar_id, function(err, val) {
        callback(err, val.measurement);
      });
    },
    // 3. Update the measurement
    function(callback) {
      sqlite.updateBloodSugar(user_id, {
        blood_sugar_id: blood_sugar_id,
        measurement_time: '2015-12-10 11:00',
        measurement: 43
      }, callback);
    },
    // 4. Get back the new measurement
    function(callback) {
      sqlite.getBloodSugar(user_id, blood_sugar_id, callback);
    },
    // 5. Delete the measurement
    function(callback) {
      sqlite.deleteBloodSugar(user_id, blood_sugar_id, callback);
    },
    // 6. Delete the user
    function(callback) {
      sqlite.deleteUser(user_id, callback);
    }
  ], function(err, results) {compileTestResult(err, results, 'testBloodSugarCrud', function(results) {
    if (results[2]==42 && results[4].measurement == 43) {
      return null;
    } else {
      return 'Expected 42 and 43, and got ' + results[2] + ' and ' +results[4].measurement;
    }
  });}
);
}

var testMealCrud = function(callback) {
  var _err=null, user_id, meal_id;
  async.series([
    // 0. First, create a user for testing
    function(callback) {
      sqlite.addUser({user_name: 'Test User Meal'}, function(err, val) {
        user_id = val;
        callback(err, val);
      });
    },
    // 1. Create a meal
    function(callback) {
      sqlite.addMeal(user_id, {est_carbs: 20}, function(err, val) {
        meal_id = val;
        callback(err, val);
      });
    },
    // 2. Get the meal detail's est_carbs
    function (callback) {
      sqlite.getMeal(user_id, meal_id, function(err, val) {
        callback(err, val.est_carbs);
      });
    },
    // 3. Update the meal's est_carbs
    function(callback) {
      sqlite.updateMeal(user_id, {meal_ID: meal_id, est_carbs: 25, meal_time: '2015-12-04 12:00'}, function(err) {
        callback(err, null);
      });
    },
    // 4. Get the meal's new est_carbs
    function(callback) {
      sqlite.getMeal(user_id, meal_id, function(err, val) {
        callback(err, val.est_carbs);
      });
    },
    // 5. Delete the meal.
    function(callback) {
      sqlite.deleteMeal(user_id, meal_id, function(err) {
        callback(err, null);
      });
    },
    // 6. Delete the user.
    function(callback) {
      sqlite.deleteUser(user_id, callback);
    }
  ], function(err, results) {
    compileTestResult(err, results, 'testMealCrud', function(results){
      if (results[2] == 20 && results[4] == 25) {
        return null;
      } else {
        return 'Expected 20 and 25, got ' + results[2] + ' and ' + results[4];
      }
    });
    if (callback) {
      callback(err);
    }
  });
};

var testUserCrud = function(callback) {
  var user_id, user, user2;
  async.series([
    // 0. Add a user, put the new id into user_id
    function(callback) {
      sqlite.addUser({user_name: 'Dan Hedges'}, function(err,val) {
        user_id = val;
        callback(err, val);
      });
    },
    // 1. Read the user back, given the user_id
    function(callback) {
      sqlite.getUser(user_id, function(err, val) {
        user = val;
        callback(err, val);
      });
    },
    // 2. List all users.
    function(callback) {
      sqlite.listUsers(function(err, val) {
        callback(err, val);
      })
    },
    // 3. Update the user at user_id with a new user_name.
    function(callback) {
      user2 = {user_id: user.user_id, user_name: 'Han Dedges'};
      sqlite.updateUser(user2, function(err, val) {callback(err);})
    },
    // 4. Again, read the user at user_id, then return the result
    function(callback) {
      sqlite.getUser(user_id, function(err, val) {callback(err, val);});
    },
    // 5. Cleanup.
    function(callback) {
      sqlite.deleteUser(user_id, function(err, val) {callback(err);});
    }
  ], function(err, results) {
    compileTestResult(err, results, 'testUserCrud', function(results) {
      if (user2.user_name == results[4].user_name) {
        return null;
      } else {
        return 'Actual ' + user2.user_name + ', Expected ' + user3.user_name;
      }
    });
    if (callback) {
      callback(err);
    }
  });
}

async.series(
  [
    testUserCrud,
    testMealCrud,
    testBloodSugarCrud,
  ],
  function(err, results) {
    if (err) {
      console.log('Error '+err);
      throw 'Error '+err;
    } else {
      console.log('All tests complete');
    }
  }
);
