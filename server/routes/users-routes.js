const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users-controller')
const auth = require('../middlewares/auth')

router.get('/register', auth.isGuest, (req, res) => {
  usersController.showRegisterPage(req, res)
})

router.post('/register', auth.isGuest, (req, res) => {
  usersController.register(req, res)
})

router.get('/login', auth.isGuest, (req, res) => {
  usersController.showLoginPage(req, res)
})

router.post('/login', auth.isGuest, (req, res) => {
  usersController.login(req, res)
})

router.post('/logout', (req, res) => {
  usersController.logout(req, res)
})

router.get('/profile/:username', auth.isAuthenticated, (req, res) => {
  usersController.showProfilePage(req, res)
})

router.post('/toggle-block/:username', auth.isAuthenticated, (req, res) => {
  usersController.toggleBlock(req, res)
})

module.exports = router
