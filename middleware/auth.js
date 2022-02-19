module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) { //驗證session是否有值(passport方法)
        return next()
      } else {
        res.redirect('/')
      }
    },
    ensureGuest: function (req, res, next) {
      if (req.isAuthenticated()) {
          res.redirect('/dashboard');
        } else {
          return next();
      }
    },
  }