import { NextFunction, Request, Response } from 'express';
// db schemas
import AuthTokensSchema from '../database schemas/authTokens.schema';
import AuthUsersSchema from '../database schemas/authUsers.schema';
import { AddAuthUser } from '../DTOs/auth.dto';
import authService from '../services/auth.service';
import { customResponse } from '../utils/customResponse';

export default {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, password: hashedPassword } = res.locals.authUser;
      const { password, email } = req.body;

      const isPasswordValid = await authService.comparePasswords(password, hashedPassword);

      if (!isPasswordValid) {
        customResponse(res, 401, 'Invalid email or password');
        return;
      }

      const tokens = authService.generateAuthTokens({ email });

      const response = await AuthTokensSchema.create({
        userId: _id,
        ...tokens,
      });
      customResponse(res, 200, 'Logged in successfully', response, 1);
      return;
    } catch (error) {
      customResponse(res, 500, 'Interval server error: error in logination process');
      console.error(error);
      next(error);
    }
  },

  register: async (req: Request<{}, {}, AddAuthUser>, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isUserRegistered = await AuthUsersSchema.findOne({ email });

      if (isUserRegistered) {
        customResponse(res, 400, 'User is already registered');
        return;
      }

      const hashedPassword = await authService.hashPassword(password);
      const authUser = await AuthUsersSchema.create({
        name,
        email,
        password: hashedPassword,
        email_verified: false,
      });

      customResponse(res, 200, 'User registered successfully', authUser, 1);
      return;
    } catch (error) {
      customResponse(res, 500, 'Interval server error: error in registration process');
      console.error(error);
      next(error);
    }
  },
};
