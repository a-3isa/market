import { Router } from "express";
import { UserController } from "../controllers/users_controller";
import { authController } from "../controllers/auth_controller";
const path = require("path");

const userRouter = Router();
const userController = new UserController();
// Make sure the method name matches the actual export in products_controller
userRouter.post("/user", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/follow", authController.protect, userController.followUser);
// userRouter.post("/", userController.createUser);
// router.get("/:id", fetechJson);

export default userRouter;
