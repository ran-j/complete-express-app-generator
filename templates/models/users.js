var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require("../bin/config")

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  }
});

UserSchema.statics.authenticate = (matricula, password, callback) => {
  Users.findOne({ matricula: matricula }).exec((err, user) => {
    if (err) return callback(err)
    if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) return callback(null, user);
      var err = new Error('Bad password or login');
      err.status = 403;
      return callback(err);
    })
  });
}

UserSchema.statics.changepwd = (userId, pwd, callback) => {
  Users.findById(userId).exec((error, ActualUser) => {
    if (err) return callback(error)

    if (ActualUser === null) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    } else {
      bcrypt.hash(pwd, 10, function (err, hash) {
        if (err) {
          return next(err);
        }
        ActualUser.password = hash;
        ActualUser.save().then((nModel) => {
          callback(null, nModel);
        });
      })
    }
  });
}

UserSchema.statics.getToken = (userId, callback) => {
  Users.findById(userId).exec((error, ActualUser) => {
    if (err) return callback(error)

    if (ActualUser === null) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    } else {
      try {
        return callback(null, jwt.sign({ ActualUser }, config.secret));
      } catch (err) {
        return callback(err)
      }
    }
  });
}

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isNew) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  } else {
    next();
  }
});

var Users = mongoose.model('Users', UserSchema);

module.exports = Users;