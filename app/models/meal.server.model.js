var _db = null;

var _validateDB = function() {
  if (!_db.addMeal || !_db.getMeal || !_db.listMeals || !_db.updateMeal|| !_db.deleteMeal) {
    throw 'Meal model db missing functions';
  }
}

var item={};
item.init = function(db) {
  if (_db != null) {
    throw 'Meal model db already initialized';
  }
  _db = db;
  _validateDB();
  item.add = db.addMeal;
  item.get = db.getMeal;
  item.list = db.listMeals;
  item.update = db.updateMeal;
  item.delete = db.deleteMeal;
}

module.exports = item;
