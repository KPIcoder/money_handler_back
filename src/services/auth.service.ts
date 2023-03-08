import { Types } from 'mongoose';
import { RegisterUser } from '../DTOs/auth.dto';
import passwordHelper from '../helpers/password.helper';
import AuthUsersSchema from '../database schemas/authUsers.schema';
import tokenService from './token.service';

export default {
  addUser: async (addAuthUser: RegisterUser) => {
    const hashedPassword = await passwordHelper.hashPassword(addAuthUser.password);
    return AuthUsersSchema.create({
      name: addAuthUser.name,
      email: addAuthUser.email,
      password: hashedPassword,
    });
  },

  addUserTokens: (email: string) => {
    const tokens = tokenService.generateAuthTokens({ email });
    return AuthUsersSchema.findOneAndUpdate({ email }, { ...tokens }, { new: true });
  },

  removeUserTokens: (accessToken: string) =>
    AuthUsersSchema.findOneAndUpdate(
      { access_token: accessToken },
      { access_token: null, refresh_token: null },
      { new: true }
    ),

  comparePasswords: (password: string, hashedPassword: string) =>
    passwordHelper.comparePasswords(password, hashedPassword),

  findAuthUserByEmail: (email: string) => AuthUsersSchema.findOne({ email }),

  findAuthUserByAccessToken: (accessToken: string) => AuthUsersSchema.findOne({ access_token: accessToken }),

  refreshUserTokens: (oldRefreshToken: string) => {
    const tokens = tokenService.generateAuthTokens();
    return AuthUsersSchema.findOneAndUpdate({ refresh_token: oldRefreshToken }, { ...tokens }, { new: true });
  },
};
