import { NextFunction, Request, Response } from 'express';
import { getUsers } from '../services/user.service';
import { customResponse } from '../utils/customResponse';

export default {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await getUsers();
      customResponse(res, 200, 'Success', users, users.length);
    } catch (error) {
      customResponse(res, 500, 'Interval server error: Error in getting users');
    }
  },
};
