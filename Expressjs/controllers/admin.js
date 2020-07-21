const mongodb = require("mongodb");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //   send response
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const product = new Product(
    title,
    imageUrl,
    description,
    price,
    null,
    req.user._id
  );
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

exports.getAdminProducts = (req, res, next) => {
  //   send response
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.editMode;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    })
    .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;

  const product = new Product(
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice,
    new mongodb.ObjectID(productId)
  );
  // save method either saves a new product (if it doesn't exist) or updates the product information
  return product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};
