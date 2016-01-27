var crypto=require('crypto');

var _db = null;

var _validateDB = function() {
  if (!_db.addUser || !_db.getUser || !_db.getUserByName || !_db.listUsers || !_db.updateUser || !_db.deleteUser) {
    throw 'User model db missing functions';
  }
}

// Minimum password requirements.
var _validatePassword = function(password) {
  if (typeof(password) != "string") {
    return false;
  }
  if (password.length < 8) {
    return false;
  }
  return true;
}

var _generateSalt = function() {
  return new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
}

var _hashPassword = function(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
}

var item={};
item.init = function(db) {
  if (_db != null) {
    throw 'User model db already initialized';
  }
  _db = db;
  _validateDB();
  item.add = db.addUser;
  item.get = db.getUser;
  item.getByName = db.getUserByName;
  item.list = db.listUsers;
  item.update = db.updateUser;
  item.delete = db.deleteUser;
  item.generateSalt = _generateSalt;
  item.hashPassword = _hashPassword;
}

module.exports = item;
