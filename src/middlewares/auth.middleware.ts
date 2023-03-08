import { NextFunction, Request, Response } from 'express';

// dto
import { AuthActions, AuthUser, LoginUser, RegisterUser } from '../DTOs/auth.dto';
import { MongoResWithId } from '../DTOs/common';
// services
import authService from '../services/auth.service';
import tokenService from '../services/token.service';
// validator
import { loginUserValidator, registerUserValidator } from '../validators/auth.validator';
// utils
import { customResponse } from '../utils/customResponse';

export default {
  validateRegisterBody: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = registerUserValidator.validate(req.body);

      if (error) {
        console.error(error);
        customResponse(res, 400, error.message);
        next(error);
      }

      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  },

  validateLoginBody: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = loginUserValidator.validate(req.body);

      if (error || !value) {
        customResponse(res, 400, error.message);
        next(error);
      }

      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  },

  checkIsUserRegistered:
    (authAction: AuthActions) =>
    async (
      req: Request<{}, {}, LoginUser | RegisterUser>,
      res: Response<{}, Record<'authUser', MongoResWithId<AuthUser>>>,
      next: NextFunction
    ) => {
      try {
        const { email } = req.body;
        const authUser: MongoResWithId<AuthUser> | null = await authService.findAuthUserByEmail(email);

        if (authAction === AuthActions.register && authUser) {
          const errorMessage = 'User is already registered';
          customResponse(res, 400, errorMessage);
          next(new Error(errorMessage));
        }

        if ((authAction === AuthActions.login || authAction === AuthActions.logout) && !authUser) {
          const errorMessage = 'User not found';
          customResponse(res, 404, errorMessage);
          next(new Error(errorMessage));
        }
        res.locals.authUser = authUser as MongoResWithId<AuthUser>;
        next();
      } catch (error) {
        next(error);
      }
    },

  checkIsUserLoggedIn: async (req: Request, res: Response<{}, Record<'accessToken', string>>, next: NextFunction) => {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        const errorMessage = 'Unauthorized: auth headers are not set';
        customResponse(res, 401, errorMessage);
        next(new Error(errorMessage));
      }

      const headerContent = authorizationHeader?.split(' ') as string[];

      if (headerContent[0] !== 'Bearer') {
        const errorMessage = 'Unauthorized: auth headers are incorrect';
        customResponse(res, 401, errorMessage);
        next(new Error(errorMessage));
      }

      const accessToken = headerContent[1];
      const isAccessTokenValid = tokenService.checkAccessToken(accessToken);

      if (!isAccessTokenValid) {
        const errorMessage = 'Unauthorized: access token has expired or it is incorrect';
        customResponse(res, 401, errorMessage);
        next(new Error(errorMessage));
      }

      res.locals.accessToken = accessToken;
      next();
    } catch (error) {
      next(error);
    }
  },

  validateRefreshToken: async (req: Request, res: Response<{}, Record<'refreshToken', string>>, next: NextFunction) => {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        const errorMessage = 'Unauthorized: auth headers are not set';
        customResponse(res, 401, errorMessage);
        next(new Error(errorMessage));
      }

      const headerContent = authorizationHeader?.split(' ') as string[];

      if (headerContent[0] !== 'Bearer') {
        const errorMessage = 'Unauthorized: auth headers are incorrect';
        customResponse(res, 401, errorMessage);
        next(new Error(errorMessage));
      }

      const refreshToken = headerContent[1];
      const isRefreshTokenValid = tokenService.checkRefreshToken(refreshToken);

      if (!isRefreshTokenValid) {
        const errorMessage = 'Unauthorized: refresh token token has expired or it is incorrect';
        customResponse(res, 401, errorMessage);
        next(new Error(errorMessage));
      }

      res.locals.refreshToken = refreshToken;
      next();
    } catch (error) {
      next(error);
    }
  },
};
