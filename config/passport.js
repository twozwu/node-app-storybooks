const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
const redirect = process.env.NODE_ENV === 'production' ? 'https://node-app-storybooks-ssr.onrender.com' : ''

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: redirect + "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id }); //查資料庫有無此用戶

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser); //如果沒有就新增用戶
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  //可設定要將哪些 user 資訊，儲存在 Session 中的 passport.user。（如 user._id）(被動觸發)
  passport.serializeUser((user, done) => {
    // 只將用戶 id 序列化存到 session 中
    done(null, user.id);
  });

  //從 Session 中獲得的資訊去撈該 user 的資料(被動觸發)
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
