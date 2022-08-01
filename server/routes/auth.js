const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");

// router.get("/", (req, res) => {
//   res.send("hello");
// });
// router.get("/protected", requireLogin, (req, res) => {
//   res.send("Hello User");
// });
//signup or register
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  //  else {
  //   res.json({ message: "successfully posted" });
  // }
  User.findOne({ email: email })
    .then((savedUser) => {
      console.log(savedUser);
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
        });
        console.log(`user = ${user}`);

        user
          .save()
          .then((user) => {
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
//signin or login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Please add email or password" });
  }
  User.findOne({ email: email }).then((saveduser) => {
    // console.log(`SavedUser = ${saveduser}`);
    if (!saveduser) {
      return res.status(422).json({ error: "Invalid Email or Password" });
    }
    bcrypt
      .compare(password, saveduser.password)
      .then((doMatch) => {
        console.log(`password= ${password}`);
        console.log(`saveduserpassword= ${saveduser.password}`);
        console.log(doMatch);
        if (doMatch) {
          // res.json({ message: "successfully signed in" });
          const token = jwt.sign({ _id: saveduser._id }, JWT_SECRET);
          const { _id, name, email, followers, followings } = saveduser;
          res.json({
            token: token,
            user: { _id, name, email, followers, followings },
          });
        } else {
          return res.status(422).json({ error: "Invalid Email or Password" });
        }
      })

      .catch((err) => {
        console.log(err);
      });
  });
});
module.exports = router;
