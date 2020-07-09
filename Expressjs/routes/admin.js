const path = require("path");

const express = require("express");
const rootDir = require("../util/path");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  //   send response
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

module.exports = { router: router, products: products };
