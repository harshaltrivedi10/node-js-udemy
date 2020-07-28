const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5f1deb631e1b6b51ccd4c7a4")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((error) => {
        res.redirect("/");
      });
    })
    .catch((error) => console.log(user));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
