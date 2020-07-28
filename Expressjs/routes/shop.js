const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/delete-cart-item", isAuth, shopController.deleteCartItem);

router.post("/cart", isAuth, shopController.postCart);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/create-order", isAuth, shopController.postOrder);

// router.get("/checkout", shopController.getCheckout);

router.get("/", shopController.getIndex);

module.exports = router;
