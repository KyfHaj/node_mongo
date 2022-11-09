require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose');
const md5 = require("md5");

const app = express()

app.use(express.static("public")) // Folder public cho image
app.use(bodyparser.urlencoded({
  extended: true
}))

// Kết nối mongodb

mongoose.connect(
  `mongodb://52.68.180.49:27017/userDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB!!');
      app.listen(80);
    }
  }
);

// Tạo mẫu document (1)
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

// Tạo mẫu document (2)
const User = new mongoose.model("User", userSchema)

////////////////////////////////////// Home
app.get("/", function(req,res){
  res.render("home.ejs")
})

////////////////////////////////////// Login
app.get("/login", function(req,res){
  res.render("login.ejs")
})

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
// Tự động giải mã luôn?
  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets.ejs");
        }
      }
    }
  });
});

////////////////////////////////////// Register
app.get("/register", function(req,res){
  res.render("register.ejs")
})
app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  })

  newUser.save(function(err){
    if (err) {
      console.log(err)
    } else {
      res.render("secrets.ejs")
    }
  }
)})

//////////////////////////////////////
app.get("/secrets", function(req,res){
  res.render("secrets.ejs")
})

app.get("/submit", function(req,res){
  res.render("submit.ejs")
})

app.listen(3000, () => {
  console.log(`Server start on port ${3000}`)
})
