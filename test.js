var sqlite = require('./sqlite.js'),
  async = require('async');

var testUserCrud = function() {
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
    // 2. Update the user at user_id with a new user_name.
    function(callback) {
      user2 = {user_id: user.user_id, user_name: 'Han Dedges'};
      sqlite.updateUser(user2, function(err, val) {callback(err);})
    },
    // 3. Again, read the user at user_id, then return the result
    function(callback) {
      sqlite.getUser(user_id, function(err, val) {callback(err, val);});
    },
    // 4. Cleanup.
    function(callback) {
      sqlite.deleteUser(user_id, function(err, val) {callback(err);});
    }
  ], function(err, results) {
    if (err) {
      console.log('Error '+err);
    } else {
      if (user2.user_name == results[3].user_name) {
        console.log('Passed testUserCrud');
      } else {
        throw 'Error: Actual ' + user2.user_name + ', Expected ' + user3.user_name;
      }
    }
  });
}

testUserCrud();
