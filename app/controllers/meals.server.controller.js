var meals = require('../models/meal.server.model.js');

var getErrorMessage = function(err) {
  return 'Unknown server error';
}

exports.create = function(req, res) {
  // meal.est_carbs
  var meal = {
    est_carbs: req.body.est_carbs
  }
  var user_id = req.user.user_id;
  meals.add(user_id, meal, function(err, meal_id) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(meal_id);
    }
  });
};

exports.list = function(req, res) {
  meals.list(req.user_id, function(err, meals) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(meals);
    }
  })
};

exports.mealById = function(req, res, next, meal_id) {
  meals.get(req.user.user_id, meal_id, function(err, obj) {
    if (err) {
      next(err);
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      req.meal = obj;
      //res.json(obj);
      next();
    }
  })
}

exports.read = function(req, res) {
  res.json(req.meal);
}

exports.update = function(req, res) {
  var meal = req.meal;
  if (req.body.meal_time) {
    meal.meal_time = req.body.meal_time;
  }
  if (req.body.est_carbs) {
    meal.est_carbs = req.body.est_carbs;
  }
  meals.update(req.user_id, meal, function(err) {
    if (err) {
      res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(meal);
    }
  })
}

exports.delete = function(req, res) {
  var meal = req.meal;
  meals.delete(req.user_id, meal.meal_id, function(err) {
    if (err) {
      res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(meal);
    }
  });
}

exports.hasAuthorization = function(req, res, next) {
  if (req.meal.user_id !== req.user_id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
