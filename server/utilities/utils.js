
function isNullOrWhiteSpace (value) {
  return (value == null || !/\S/.test(value))
}

function redirectBack (req, res) {
  let backURL = req.header('Referer') || '/'

  res.redirect(backURL)
}

function generateRandomString (length = 20) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

module.exports = {
  isNullOrWhiteSpace,
  redirectBack,
  generateRandomString
}
