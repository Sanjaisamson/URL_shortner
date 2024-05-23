const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const authHandler = require("../middleware/auth.middleware");

userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/refresh", authHandler.refreshTokenVerification);
userRouter.post(
  "/logout",
  authHandler.accessTokenVerification,
  userController.logoutUser
);

module.exports = userRouter;
