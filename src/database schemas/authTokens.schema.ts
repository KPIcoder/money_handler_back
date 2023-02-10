import { Schema, model } from "mongoose";
import { MODEL_NAMES } from "./modelNames";

const AuthTokensSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.authUsers,
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model(MODEL_NAMES.authTokens, AuthTokensSchema);
