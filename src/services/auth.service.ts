import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import config from "../utils/configs";

export default {
  hashPassword: async (password: string) => await bcrypt.hash(password, 10),
  comparePasswords: async (password: string, hashedPassword: string) =>
    await bcrypt.compare(password, hashedPassword),

  generateAuthTokens: (payload: JwtPayload = {}) => {
    const access_token = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refresh_token = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
      expiresIn: "10d",
    });
    return { access_token, refresh_token };
  },
};
