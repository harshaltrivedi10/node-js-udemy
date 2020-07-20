const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

exports.getProducts = (req, res, next) => {
  //   send response
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => console.log(error));
};

exports.getCart = (req, res, next) => {
  // Cart.getCart((cart) => {
  //   const cartProducts = [];
  //   Product.fetchAll((products) => {
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ product, quantity: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       pageTitle: "Your Cart",
  //       path: "/cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            pageTitle: "Your Cart",
            path: "/cart",
            products,
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // ...
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((error) => console.log(error));
};

exports.deleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((error) => console.log(error));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your orders",
        path: "/orders",
        orders,
      });
    })
    .catch((error) => console.log(error));
};

exports.postOrder = (req, res, next) => {
  let products;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((prods) => {
      products = prods;
      return req.user.createOrder();
    })
    .then((order) => {
      return order.addProducts(
        products.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      );
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((error) => console.log(error));
};
