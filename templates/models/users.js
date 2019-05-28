var mongoose = require('mongoose');

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

//Change pwd
UserSchema.statics.changepwd = function (userId, pwd, callback) {
    User.findById(userId).exec((error, ActualUser) => {
        if(error) return callback(err, -1)
        if (!ActualUser)  return callback('User not found.', -1);
        ActualUser.password = pwd;
        ActualUser.save().then(() => callback(null, 1)).catch((er) => callback(er, -1));
    });
}


var Users = mongoose.model('Users', UserSchema);

module.exports = Users;