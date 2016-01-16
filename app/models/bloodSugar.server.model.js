var _db = null;

var _validateDB = function() {
  if (!_db.addBloodSugar || !_db.getBloodSugar || !_db.listBloodSugars || !_db.updateBloodSugar|| !_db.deleteBloodSugar) {
    throw 'BloodSugar model db missing functions';
  }
}

var item={};
item.init = function(db) {
  if (_db != null) {
    throw 'BloodSugar model db already initialized';
  }
  _db = db;
  _validateDB();
  item.add = db.addBloodSugar;
  item.get = db.getBloodSugar;
  item.list = db.listBloodSugars;
  item.update = db.updateBloodSugar;
  item.delete = db.deleteBloodSugar;
}

module.exports = item;
