const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
//   _creator: {type: mongoose.Schema.ObjectId, ref: 'User'},
  sender: String,
  content: String,
  likedBy: [String]
}, {timestamps: true})

const threadSchema = mongoose.Schema({
  participants: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  messages: [messageSchema]
}, {timestamps: true})

module.exports = mongoose.model('Thread', threadSchema)
