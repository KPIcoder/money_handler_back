import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '../utils/configs';

export default {
  generateAuthTokens: (payload: JwtPayload = {}) => {
    const access_token = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    const refresh_token = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
      expiresIn: '10d',
    });
    return { access_token, refresh_token };
  },

  checkAccessToken: (accessToken: string) => {
    try {
      const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
      return Boolean(decoded);
    } catch (error) {
      return false;
    }
  },

  checkRefreshToken: (refreshToken: string) => {
    try {
      const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
      return Boolean(decoded);
    } catch (error) {
      return false;
    }
  },
};
