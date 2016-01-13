var _db = null;

var _validateDB = function() {
  if (!_db.addUser || !_db.getUser || !_db.listUsers || !_db.updateUser || !_db.deleteUser) {
    throw 'User model db missing functions';
  }
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
  item.list = db.listUsers;
  item.update = db.updateUser;
  item.delete = db.deleteUser;
}

module.exports = item;
