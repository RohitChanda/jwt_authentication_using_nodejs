const jwt = require("jsonwebtoken");
const client = require("../redis/redis");

module.exports = {
  generateUserToken: async (user) => {
    try {
      const payload = {
        _id: user.id,
        email: user.email,
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1m",
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      await client.SET(user.id, refreshToken, {
        EX: 1 * 24 * 60 * 60, // in second
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(error);
    }
  },
  verifyRefreshToken: async (refreshToken) => {
    try {
      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const cacheData = await client.GET(decode._id);
      if (cacheData !== refreshToken) {
        throw new Error("Invalid refresh token!!!");
      }

      return decode;
    } catch (error) {
      throw new Error(error);
    }
  },
};
