import { NextFunction, Request, Response } from 'express';

import { AuthUser, LoginUser, RegisterUser } from '../DTOs/auth.dto';
import { MongoResWithId } from '../DTOs/common';
import authService from '../services/auth.service';
import { customResponse } from '../utils/customResponse';

export default {
  login: async (
    req: Request<{}, {}, LoginUser>,
    res: Response<{}, Record<'authUser', MongoResWithId<AuthUser>>>,
    next: NextFunction
  ) => {
    try {
      const { password: hashedPassword } = res.locals.authUser;
      const { password, email } = req.body;

      const isPasswordValid = await authService.comparePasswords(password, hashedPassword);

      if (!isPasswordValid) {
        customResponse(res, 400, 'Invalid email or password');
        return;
      }

      const user = await authService.addUserTokens(email);

      if (user) {
        res.cookie('isAuthorised', true, {
          expires: new Date(Date.now() + 60 * 60 * 1000),
          httpOnly: false,
        });
        customResponse(res, 200, 'Logged in successfully', user, 1);
        return;
      }

      customResponse(res, 400, 'Unknown client error');
      return;
    } catch (error) {
      customResponse(res, 500, 'Interval server error: error in logination process');
      console.error(error);
      next(error);
    }
  },

  register: async (req: Request<{}, {}, RegisterUser>, res: Response, next: NextFunction) => {
    try {
      const authUser = await authService.addUser(req.body);

      if (authUser) {
        customResponse(res, 200, 'User registered successfully', authUser, 1);
        return;
      }

      customResponse(res, 400, 'Unknown client error');
      return;
    } catch (error) {
      customResponse(res, 500, 'Interval server error: error in registration process');
      console.error(error);
      next(error);
    }
  },

  logout: async (req: Request, res: Response<{}, Record<'accessToken', string>>, next: NextFunction) => {
    try {
      const { accessToken } = res.locals;
      const removedTokens = await authService.removeUserTokens(accessToken);

      customResponse(res, 200, 'Logged out succesfully', removedTokens, 1);
    } catch (error) {
      customResponse(res, 500, 'Interval server error: error in logout process');
      console.error(error);
      next(error);
    }
  },

  resetTokens: async (req: Request, res: Response<{}, Record<'refreshToken', string>>, next: NextFunction) => {
    try {
      const { refreshToken } = res.locals;
      const authUser = await authService.refreshUserTokens(refreshToken);

      if (!authUser) {
        customResponse(res, 400, 'Unknown client error');
        return;
      }
      const tokens = { accessToken: authUser.access_token, refreshToken: authUser.refresh_token };
      customResponse(res, 201, 'Tokens updated successfully', tokens, 1);
    } catch (error) {
      console.error(error);
      customResponse(res, 500, 'Interval server error: error in resetting tokens');
      next(error);
    }
  },

  getCurrentAuthUser: async (req: Request, res: Response<{}, Record<'accessToken', string>>, next: NextFunction) => {
    try {
      const { accessToken } = res.locals;
      const user = await authService.findAuthUserByAccessToken(accessToken);
      customResponse(res, 200, 'Got user successfully', user, 1);
    } catch (error) {}
  },
};
