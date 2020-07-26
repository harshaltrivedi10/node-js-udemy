const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5f1deb631e1b6b51ccd4c7a4")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(user));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotFound);

mongoose
  .connect("mongodb+srv://harshal:Harshal1!@cluster0-2vfz0.mongodb.net/shop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Harshal",
            email: "test@test.com",
            cart: {
              items: [],
            },
          });
          user.save();
        }
      })
      .catch((error) => console.log(error));
    app.listen(3000);
  })
  .catch((error) => console.log(error));
