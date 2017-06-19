const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
let userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: String,
  roles: [String],
  blacklist: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
})

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

userSchema.methods.validPassword = (attemptPassword, hashedUserPassword) => {
  return bcrypt.compareSync(attemptPassword, hashedUserPassword)
}

module.exports = mongoose.model('User', userSchema)
