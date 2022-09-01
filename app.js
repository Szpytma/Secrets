require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const localDb = "mongodb://localhost:27017/userDB";
const port = 3000;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port || process.env.PORT);
mongoose.connect(localDb);

const secretSchema = new mongoose.Schema({ secret: String });
const Secret = new mongoose.model("Secret", secretSchema);

const userSchema = new mongoose.Schema({ username: String, password: String });

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const login = req.body.username;
  const password = req.body.password;

  User.findOne({ username: login }, function (err, user) {
    if (user.password === password) {
      res.render("secrets");
      console.log(user.username + " Logged in");
    } else {
      console.log("Incorrect login or password");
    }
  });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
      console.log(user);
    }
  });
});

app.get("/secrets", function (req, res) {
  res.render("secrets");
});

app.get("/submit", function (req, res) {
  res.render("submit");
});
