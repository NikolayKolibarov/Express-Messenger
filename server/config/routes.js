const users = require('../routes/users-routes')
const threads = require('../routes/threads-routes')
const Thread = require('../models/Thread')

module.exports = (app) => {
  app.get('/', (req, res) => {
    if (!req.user) {
      return res.render('home', {title: 'Home'})
    }

    Thread
    .find({'participants': req.user._id})
    .sort({createdAt: -1})
    .populate('participants')
    .then(threads => {
      res.render('home', {title: 'Home', threads, errors: req.session.errors})
      req.session.errors = null
    })
  })

  app.use('/users', users)
  app.use('/thread', threads)
}
