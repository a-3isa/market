import { Router } from "express";
import { ProductController } from "../controllers/products_controller";
import { authController } from "../controllers/auth_controller";
const path = require("path");

const productRouter = Router();
const productController = new ProductController();
// Make sure the method name matches the actual export in products_controller
productRouter.post(
  "/",
  authController.protect,
  productController.createProduct
);
// router.get("/:id", fetechJson);
// productRouter.get("/", authController.protect, productController.getProducts);
productRouter.get("/", productController.getProducts);
productRouter.delete(
  "/",
  authController.protect,
  productController.deleteProduct
);

export default productRouter;
