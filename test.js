var sqlite = require('./sqlite.js');

var _handleErr= function(err) {
  if (err) {
    console.log('Error: '+err);
  }
}

var testUserCrud = function() {
  debugger;
  var user_id = null;
  sqlite.addUser({user_name: 'Dan Hedges'}, function(err, val) {_handleErr(err); user_id=val;});
  var user = null;
  sqlite.getUser(user_id, function(err, val) {_handleErr(err); user=val;});
  var user2 = {user_id: user.user_id, user_name: 'Han Dedges'};
  sqlite.updateUser(user2, _handleErr);
  var user3 = null;
  sqlite.getUser(user_id, function(err, val) {_handleErr(err); user3=val;});
  if (user2.user_name != user3.user_name) {
    throw 'updateUser FAILED';
  }
  sqlite.deleteUser(user_id, _handleErr);
}

testUserCrud();
