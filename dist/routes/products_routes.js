"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("../controllers/products_controller");
const auth_controller_1 = require("../controllers/auth_controller");
const path = require("path");
const productRouter = (0, express_1.Router)();
const productController = new products_controller_1.ProductController();
// Make sure the method name matches the actual export in products_controller
productRouter.post("/", auth_controller_1.authController.protect, productController.createProduct);
// router.get("/:id", fetechJson);
// productRouter.get("/", authController.protect, productController.getProducts);
// productRouter.delete(
//   "/",
//   authController.protect,
//   productController.deleteProduct
// );
exports.default = productRouter;
