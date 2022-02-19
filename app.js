const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const methodOverride = require('method-override') //使用不同的method覆蓋POST方法
const morgan = require("morgan"); //日誌紀錄
const exphbs = require("express-handlebars"); //模板引擎
const passport = require("passport"); //入第三方套件庫
const session = require("express-session"); //讀寫session空間
const MongoStore = require("connect-mongo"); //用程式操作mongo
const connectDB = require("./config/db");

//Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')

// Handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers:{
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ //將session存到MongoDB
      mongoUrl: process.env.MONGO_URI,
      dbName: "storybooks",
      stringify: false,
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var，所有函式都經過這裡
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth")); //第三方認證
app.use('/stories', require("./routes/stories"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
