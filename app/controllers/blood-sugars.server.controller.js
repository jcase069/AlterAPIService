var bloodSugars = require('../models/bloodSugar.server.model.js');

var getErrorMessage = function(err) {
  return 'Unknown server error';
}

exports.create = function(req, res) {
  var bloodSugar = {
    measurement: req.body.measurement,
    measurement_time: req.body.measurement_time,
  }
  var user_id = req.user.user_id;
  bloodSugars.add(user_id, bloodSugar, function(err, blood_sugar_id) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json({_id: blood_sugar_id});
    }
  });
};

exports.list = function(req, res) {
  bloodSugars.list(req.user.user_id, function(err, lst) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(lst);
    }
  })
};

exports.bloodSugarById = function(req, res, next, blood_sugar_id) {
  bloodSugars.get(req.user.user_id, blood_sugar_id, function(err, obj) {
    if (err) {
      next(err);
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      req.blood_sugar = obj;
      //res.json(obj);
      next();
    }
  })
}

exports.read = function(req, res) {
  res.json(req.blood_sugar);
}

exports.update = function(req, res) {
  var bloodSugar = req.blood_sugar;
  if (req.body.measurement_time) {
    bloodSugar.measurement_time = req.body.measurement_time;
  }
  if (req.body.measurement) {
    bloodSugar.measurement = req.body.measurement;
  }
  bloodSugars.update(req.user.user_id, bloodSugar, function(err) {
    if (err) {
      res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(bloodSugar);
    }
  })
}

exports.delete = function(req, res) {
  var bloodSugar = req.blood_sugar;
  bloodSugars.delete(req.user.user_id, bloodSugar.blood_sugar_id, function(err) {
    if (err) {
      res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(bloodSugar);
    }
  });
}

exports.hasAuthorization = function(req, res, next) {
  if (req.blood_sugar.user_id !== req.user.user_id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
