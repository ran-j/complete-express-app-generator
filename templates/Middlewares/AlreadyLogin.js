const AlreadyLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        res.redirect('/home')
    } else {
      return next(); 
    }
}

module.exports = AlreadyLogin;