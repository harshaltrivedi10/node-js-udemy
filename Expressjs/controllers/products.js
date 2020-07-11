const Product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
  //   send response
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  //   send response
  Product.fetchAll((products) => {
    res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
  });
};
