const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] })) //呼叫google認證

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), //如果認證失敗會回到首頁
  (req, res) => {
    res.redirect('/dashboard') //如果認證成功則回到儀表板
  }
)

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout() //passport內建函式，將使用者存在 session 的資料作廢
  res.redirect('/')
})

module.exports = router