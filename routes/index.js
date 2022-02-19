const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require('../models/Story')


router.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "login" }); //渲染網頁
});


router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({ user: req.user.id }).lean()
      res.render('dashboard', {
        name: req.user.firstName,
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })
// router.get("/dashboard", ensureAuth, (req, res) => {
//   console.log(req.user);
//   res.render("dashboard", { name: req.user.firstName});
// });

module.exports = router;
