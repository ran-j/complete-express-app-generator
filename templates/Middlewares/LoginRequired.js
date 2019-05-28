const requiresLogin = (req, res, next) => {
 
    if (req.session && req.session.userId) {
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      return next();
    } else {
      res.end("Login required") 
    }

}

module.exports = requiresLogin;