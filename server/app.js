const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
require("./models/user");
require("./models/post");
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
mongoose.connect(MONGOURI);

mongoose.connection.on("connected", () => {
  console.log("connected to mongo...yeah yeah");
});
mongoose.connection.on("error", () => {
  console.log("error connecting");
});
// const customMiddleware = (req, res, next) => {
//   console.log("middleware executed");
//   next();
// };
// //app.use(customMiddleware);it will apply to all the routes
// //to apply it to a particular route write within that route the middleware name;
// app.get("/", (req, res) => {
//   console.log("home");
//   res.send("hello world");
// });
// app.get("/about", customMiddleware, (re, res) => {
//   console.log("about");
//   res.send("about page");
// });
app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
//KJ4AnNBVb50nqMLk
