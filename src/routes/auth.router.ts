import express from 'express';
import authController from '../controllers/auth.controller';
import { AuthActions } from '../DTOs/auth.dto';
import authMiddleware from '../middlewares/auth.middleware';

const authRouter = express.Router();

authRouter.post(
  '/register',
  authMiddleware.validateRegisterBody,
  authMiddleware.checkIsUserRegistered(AuthActions.register),
  authController.register
);
authRouter.post(
  '/login',
  authMiddleware.validateLoginBody,
  authMiddleware.checkIsUserRegistered(AuthActions.login),
  authController.login
);
authRouter.get('/logout', authMiddleware.checkIsUserLoggedIn, authController.logout);

authRouter.get('/reset-tokens', authMiddleware.validateRefreshToken, authController.resetTokens);

authRouter.get('/user', authMiddleware.checkIsUserLoggedIn, authController.getCurrentAuthUser);

export default authRouter;
