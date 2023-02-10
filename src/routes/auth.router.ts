import express from "express";

import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post(
  "/login",
  authMiddleware.checkIsUserRegistered,
  authController.login
);

export default authRouter;
