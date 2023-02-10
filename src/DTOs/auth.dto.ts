import { Timestamps } from './common';

export type AddAuthUser = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  email_verified: boolean;
} & AddAuthUser &
  Timestamps;
