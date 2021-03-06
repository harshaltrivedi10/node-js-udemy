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
  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user,
  });
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

exports.getAdminProducts = (req, res, next) => {
  //   send response
  Product.find({ userId: req.user._id })
    // fetach related fields
    // .populate("userId")
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

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      // save method either saves a new product (if it doesn't exist) or updates the product information
      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((error) => console.log(error));
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};
