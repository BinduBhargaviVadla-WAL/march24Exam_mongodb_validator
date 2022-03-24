var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var userNameRouter = require("./routes/userNameValidator");
var productApiRoute = require("./routes/productApi");
const { default: mongoose } = require("mongoose");

var app = express();
//We are defining a connection string to connect to the mongodb
let mongoConnUrl = "mongodb://localhost/westsidenode";
mongoose.connect(mongoConnUrl, { useNewUrlParser: true });
//we are getting the connection pointer
let db = mongoose.connection;
//we are now adding error event and it will run if there is any error in connection to mongodb
db.on("error", function (error) {
  console.log("Unable to connect to the mongodb");
  console.log(error);
});
//we are adding open event and responding in the callback function if connection is established
db.on("open", function () {
  console.log("We are connected to mongodb via mongoose");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/userName", userNameRouter);
app.use("/productApi", productApiRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
