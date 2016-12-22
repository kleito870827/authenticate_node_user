const mongoose = require('mongoose');

const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
  local: {
    email: {type: String},
    password: {type: String}
  }

});

// generating
UserSchema.methods.generateHash = (password)=>{
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// check if password is valid
UserSchema.methods.validPassword = (password)=>{
  return bcrypt.compareSync(password, this.local.password);
}

// export the model
module.exports = mongoose.model('user', UserSchema);
