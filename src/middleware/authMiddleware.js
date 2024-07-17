const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send("Access Denied. No token provided.");
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      res: error.message,
    });
  }
};
module.exports = authMiddleware;
