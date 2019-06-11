var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
      return callback();
    })
  });
}

UserSchema.statics.changepwd = (userId,pwd, callback) => {
  Users.findById(userId).exec((error, ActualUser) => {
    if (err) return callback(error)

    if (ActualUser === null) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    } else {
      ActualUser.password = pwd;
      ActualUser.save();
      return callback(null, 1);
    }

  });
}

UserSchema.pre('save', (next) => {
  var user = this;
  bcrypt.hash(user.password, 10,(err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

var Users = mongoose.model('Users', UserSchema);

module.exports = Users;