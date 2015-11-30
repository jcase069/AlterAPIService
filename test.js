var sqlite = require('./sqlite.js'),
  async = require('async');

var testMealCrud = function(callback) {
  throw 'Error: Not implemented.';
  var _err=null;
  if (callback) {
    callback(_err);
  }
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
        debugger;
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
    if (err) {
      console.log('Error '+err);
    } else {
      if (user2.user_name == results[4].user_name) {
        console.log('Passed testUserCrud');
      } else {
        throw 'Error: Actual ' + user2.user_name + ', Expected ' + user3.user_name;
      }
    }
    if (callback) {
      callback(err);
    }
  });
}

async.series(
  [
    testUserCrud,
    testMealCrud,
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
