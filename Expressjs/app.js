const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoConnect = require("./util/database").mongoConnect;

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
  User.findById("5f1640815f56b755e9993389")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((error) => console.log(user));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.pageNotFound);

mongoConnect(() => {
  app.listen(3000);
});
