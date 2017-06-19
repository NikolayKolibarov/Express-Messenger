const express = require('express')
const router = express.Router()
const threadsController = require('../controllers/threads-controller')
const auth = require('../middlewares/auth')

router.post('/search', auth.isAuthenticated, (req, res) => {
  threadsController.searchForThread(req, res)
})

router.get('/:username', auth.isAuthenticated, (req, res) => {
  threadsController.showThread(req, res)
})

router.post('/:username', auth.isAuthenticated, (req, res) => {
  threadsController.sendMessage(req, res)
})

router.post('/toggle-like/:_id', auth.isAuthenticated, (req, res) => {
  threadsController.toggleLike(req, res)
})

module.exports = router
