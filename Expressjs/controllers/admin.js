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
  console.log(imageUrl);
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.editMode;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  console.log("In POst edit");
  const productId = req.body.productId;
  console.log(productId);
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;

  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect("/admin/products");
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

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};
