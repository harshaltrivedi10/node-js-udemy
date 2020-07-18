const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //   send response
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  console.log(imageUrl);
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getAdminProducts = (req, res, next) => {
  //   send response
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
