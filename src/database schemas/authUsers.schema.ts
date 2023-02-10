import { Schema, model } from 'mongoose';
import { AuthUser } from '../DTOs/auth.dto';
import { MODEL_NAMES } from './modelNames';

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
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<AuthUser>(MODEL_NAMES.authUsers, AuthUserSchema);
