import { Schema, model, Model } from 'mongoose';

import { MODEL_NAMES } from './modelNames';
import { AuthUser } from '../DTOs/auth.dto';
import { ROLES } from '../utils/constants';

const AuthUserSchema = new Schema<AuthUser>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      unique: true,
      default: null,
    },
    refresh_token: {
      type: String,
      unique: true,
      default: null,
    },
    roles: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
  },
  { timestamps: true }
);

const AuhUserModel: Model<AuthUser> = model(MODEL_NAMES.authUsers, AuthUserSchema);
export default AuhUserModel;
