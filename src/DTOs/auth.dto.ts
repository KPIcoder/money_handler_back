import { ROLES } from '../utils/constants';

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser extends LoginUser {
  name: string;
}

export interface AuthUser extends RegisterUser {
  email_verified: boolean;
  roles: ROLES;
  access_token: string;
  refresh_token: string;
}

export enum AuthActions {
  register,
  login,
  logout,
}
