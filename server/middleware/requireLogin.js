const jwt = require("jsonwebtoken");
const {} = require("../keys");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //authorization will look like below it will contain bearer and a token;
  //authorization === Bearer dhdeidhidhdiehidh414
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  console.log(`token=${token}`);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    console.log(`payload=${payload}`);
    if (err) {
      return res.status(401).json({ err: "you must be loggin in" });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      console.log(`userdata=${userdata}`);
      next();
    });
  });
};
