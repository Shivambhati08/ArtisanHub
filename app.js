if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
console.log(require("connect-mongo"));
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const serviceRouter = require("./routes/service.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;
console.log(process.env.ATLASDB_URL);
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
  console.log("mongoose connected successfully");
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24*3600,
});
store.on("error", (err)=>{
  console.log("error in mongo session store", err);
})

// const sessionOptions = {
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true, 
//   },
// };
const sessionOptions = {
  store, // ✅ Use MongoStore
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

require("./config/passportGoogle")(passport);
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/", (req, res) => {
  console.log("Root route hit");
  res.redirect("/services");
});

app.use((req, res, next)=>{ 
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.get("/demouser", async(req, res)=>{
  let fakeuser = new User({
    email: "student@gmail.com",
    username: "delta-student"
  });
 
  let registeredUser = await User.register(fakeuser, "helloworld");
  res.send(registeredUser);
})

app.use("/services", serviceRouter);
app.use("/services/:id/reviews", reviewRouter);
app.use("/profile", profileRouter);
app.use("/auth",authRouter);
app.use("/", userRouter);



app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { message });
// });
app.use((err, req, res, next) => {
  console.log("========== ERROR ==========");
  console.error(err);
  console.log("Status:", err.statusCode);
  console.log("Message:", err.message);
  console.log("Stack:", err.stack);

  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
