const brcypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid Email or Password");
        return res.redirect("/login");
      }
      brcypt
        .compare(password, user.password)
        .then((matched) => {
          // we will come here in both cases: if passwords match or don't match
          if (matched) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((error) => {
              return res.redirect("/");
            });
          }
          req.flash("error", "Invalid Email or Password");
          res.redirect("/login");
        })
        .catch((error) => {
          console.log(error);
          res.redirect("/login");
        });
    })
    .catch((error) => console.log(error));
};

exports.getSignUp = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    errorMessage,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists!");
        return res.redirect("/signup");
      }
      // cannot decrypt the password.
      return brcypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "harshaltrivedilm10@gmail.com",
            subject: "Completed Sign up",
            html: "<h1>You successfully signed up</h1>",
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      req.flash("error", "Resetting failed. Please try again!");
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    const email = req.body.email;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        // req.flash(
        //   "error",
        //   "The request to reset the password has been sent to your email address."
        // );
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "harshaltrivedilm10@gmail.com",
          subject: "Reset my password",
          html: `
            <p>Youb requested a password reset.</p>
            <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password </p>
          `,
        });
      })
      .catch((error) => console.log(error));
  });
};

exports.getNewPassword = (req, res, next) => {
  const resetToken = req.params.resetToken;
  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let errorMessage = req.flash("error");
      if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }
      res.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        errorMessage,
        userId: user._id.toString(),
        resetToken,
      });
    })
    .catch((error) => console.log(error));
};

exports.postNewPassword = (req, res, next) => {
  console.log(req.body);
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const resetToken = req.body.resetToken;
  let resetUser;
  User.findOne({
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return brcypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetToken = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((error) => console.log(error));
};
