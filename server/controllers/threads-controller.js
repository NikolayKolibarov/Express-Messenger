const Thread = require('../models/Thread')
const User = require('../models/User')

function searchForThread (req, res) {
  let currentUser = req.user
  let username = req.body.username

  // Check if user exists
  User
    .findOne({username})
    .then(user => {
      if (user) {
        if (user.username === currentUser.username) {
          req.session.errors = [{message: 'Schizophrenia is not allowed'}]
          return res.redirect(`/`)
        }

        Thread
          .findOne({'participants': {$all: [currentUser._id, user._id]}})
          .then(thread => {
            if (thread) {
              // Thread exists
              res.redirect(`/thread/${username}`)
            } else {
              let thread = new Thread()
              thread.participants.push(currentUser)
              thread.participants.push(user)
              thread.save()
              res.redirect(`/thread/${username}`)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        // No such user exists. Apply error message
        req.session.errors = [{message: 'No such user exists'}]
        res.redirect(`/`)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

function showThread (req, res) {
  let currentUser = req.user
  let username = req.params.username

  User
    .findOne({username})
    .then(user => {
      Thread
        .findOne({'participants': {$all: [currentUser._id, user._id]}})
        .populate('participants')
        .then(thread => {
          let isCurrentUserBlocked = false
          let isOtherUserBlocked = false

          // Check if current user is blocked by other user
          for (let participant of thread.participants) {
            if (!participant._id.equals(currentUser._id)) {
              for (let blockedUserId of participant.blacklist) {
                if (blockedUserId.equals(currentUser._id)) {
                  isCurrentUserBlocked = true
                  break
                }
              }
            }
          }

          // Check if other user is blocked by current user
          for (let blockedUserId of currentUser.blacklist) {
            for (let participant of thread.participants) {
              if (blockedUserId.equals(participant._id)) {
                isOtherUserBlocked = true
                break
              }
            }
          }


          // Mark liked messages by current user
          for (let message of thread.messages) {
            message.likedByCurrentUser = false
          }

          for (let message of thread.messages) {
            for (let likedByUsername of message.likedBy) {
              if (likedByUsername === currentUser.username) {
                message.likedByCurrentUser = true
                break
              }
            }
          }

          res.render('threads/thread-details', {title: 'Thread Details', thread, reciever: username, isCurrentUserBlocked, isOtherUserBlocked, errors: req.session.errors})
          req.session.errors = null
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
}

function sendMessage (req, res) {
  let currentUser = req.user
  let username = req.params.username
  let message = req.body.message

  // validate message size
  if (message.length > 1000) {
    req.session.errors = [{message: 'Message must be no more than 1000 characters.'}]
    res.redirect(`/thread/${username}`)
  }

  User
    .findOne({username})
    .then(user => {
      Thread
        .findOne({'participants': {$all: [currentUser._id, user._id]}})
        .populate('participants')
        .then(thread => {
          thread.messages.push({sender: currentUser.username, content: message})
          thread.save()
          res.redirect(`/thread/${username}`)
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
}

function toggleLike (req, res) {
  let currentUser = req.user
  let messageId = req.params._id
  let username = req.body.username

  Thread
    .findOne({'messages._id': messageId})
    .then(thread => {
      for (let message of thread.messages) {
        if (message._id.equals(messageId)) {
          if (currentUser.username === message.sender) {
            return res.redirect(`/thread/${username}`)
          }

          for (let likedByUser of message.likedBy) {
            if (likedByUser === currentUser.username) {
              let likedByUsernameIndex = message.likedBy.indexOf(currentUser.username)
              console.log('dislike')
              if (likedByUsernameIndex > -1) {
                message.likedBy.splice(likedByUsernameIndex, 1)
                thread.save()
                return res.redirect(`/thread/${username}`)
              }
            }
          }

          console.log('like')
          message.likedBy.push(currentUser.username)
          thread.save()
          return res.redirect(`/thread/${username}`)
        }
      }
    })
}

module.exports = {
  searchForThread,
  showThread,
  sendMessage,
  toggleLike
}
