"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users_controller");
const auth_controller_1 = require("../controllers/auth_controller");
const path = require("path");
const userRouter = (0, express_1.Router)();
const userController = new users_controller_1.UserController();
// Make sure the method name matches the actual export in products_controller
userRouter.post("/user", auth_controller_1.authController.signup);
userRouter.post("/login", auth_controller_1.authController.login);
userRouter.post("/follow", auth_controller_1.authController.protect, userController.followUser);
// userRouter.post("/", userController.createUser);
// router.get("/:id", fetechJson);
exports.default = userRouter;
