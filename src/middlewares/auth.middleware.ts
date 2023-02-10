import { NextFunction, Request, Response } from 'express';

import AuthUsersSchema from '../database schemas/authUsers.schema';
import { customResponse } from '../utils/customResponse';

export default {
  checkIsUserRegistered: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const authUser = await AuthUsersSchema.findOne({ email });

      if (!authUser) {
        customResponse(res, 404, 'User not found');
        return;
      }
      res.locals.authUser = authUser;
      next();
    } catch (error) {
      next(error);
    }
  },

  checkIsUserLoggedIn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accsessToken = req.headers.authorization?.split(' ')[1];

      next();
    } catch (error) {
      next(error);
    }
  },
};
