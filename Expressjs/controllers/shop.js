const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getProducts = (req, res, next) => {
  //   send response
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", { pageTitle: "Your Cart", path: "/cart" });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { pageTitle: "Your orders", path: "/orders" });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};
