// const mongoose = require('mongoose')
const User = require('../models/User')

function showRegisterPage (req, res) {
  res.render('users/user-register', { title: 'Register', errors: req.session.errors })
  req.session.errors = null
}

function register (req, res) {
  let newUserData = req.body

  if (!newUserData.username || !newUserData.password || !newUserData.confirmPassword) {
    let errors = []

    if (!newUserData.username) {
      errors.push({ message: 'The username is required.' })
    }

    if (!newUserData.password) {
      errors.push({ message: 'The password is required.' })
    }

    if (!newUserData.confirmPassword) {
      errors.push({ message: 'The password confirmation is required.' })
    }

    req.session.errors = errors

    return res.redirect('/users/register')
  }

  if (newUserData.password === newUserData.confirmPassword) {
    let user = new User()
    user.username = newUserData.username
    user.password = user.encryptPassword(newUserData.password)
    user.save(() => {
      req.logIn(user, (err, user) => {
        if (err) {
          console.log(err)
        }

        res.redirect('/')
      })
    })
  }
}

function showLoginPage (req, res) {
  res.render('users/user-login', { title: 'Login', errors: req.session.errors })
  req.session.errors = null
}

function login (req, res) {
  let possibleUser = req.body

  if (!possibleUser.username || !possibleUser.password) {
    let errors = []

    if (!possibleUser.username) {
      errors.push({ message: 'The username is required.' })
    }

    if (!possibleUser.password) {
      errors.push({ message: 'The password is required.' })
    }

    req.session.errors = errors

    return res.redirect('/users/login')
  }

  User.findOne({ username: possibleUser.username }, (err, user) => {
    if (err) {
      console.log(err)
    }

    if (user) {
      if (user.validPassword(possibleUser.password, user.password)) {
        req.logIn(user, (err, user) => {
          if (err) {
            console.log(err)
          }

          res.redirect('/')
        })
      } else {
        req.session.errors = [{ message: 'Username or password is incorrect.' }]

        res.redirect('/users/login')
      }
    } else {
      req.session.errors = [{ message: 'Username or password is incorrect.' }]

      res.redirect('/users/login')
    }
  })
}

function logout (req, res) {
  req.logout()
  res.redirect('/')
}

function showProfilePage (req, res) {
  let username = req.params.username

  User
        .findOne({ username: username })
        .then(user => {
          if (user) {
            res.render('users/user-profile', {
              title: 'Profile',
              user: user
            })
          } else {
            res.redirect('/')
          }
        })
        .catch(err => {
          console.log(err)
        })
}

function toggleBlock (req, res) {
  let currentUser = req.user
  let username = req.params.username

  User
   .findOne({username})
   .then(user => {
     for (let blockedUserId of currentUser.blacklist) {
       if (blockedUserId.equals(user._id)) {
         // unblock user
         let blockedUserIdIndex = currentUser.blacklist.indexOf(blockedUserId)
         console.log('unblock')
         if (blockedUserIdIndex > -1) {
           currentUser.blacklist.splice(blockedUserIdIndex, 1)
           currentUser.save()
           return res.redirect(`/thread/${username}`)
         }
       }
     }

     // block user
     console.log('block')

     currentUser.blacklist.push(user)
     currentUser.save()
     return res.redirect(`/thread/${username}`)
   })
}

module.exports = {
  showRegisterPage,
  register,
  showLoginPage,
  login,
  logout,
  showProfilePage,
  toggleBlock
}
