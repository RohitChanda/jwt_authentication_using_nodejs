const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const generateUserToken = (user) => {
  const payload = {
    _id: user.id,
    email: user.email,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  return { accessToken, refreshToken };
};

const createUser = async (req, res) => {
  try {
    const payload = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = new User(payload);
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(200).json({ user: payload, msg: "user created succesfully!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json([
      {
        res: error,
      },
    ]);
  }
};

const handleUserlogin = async (req, res) => {
  try {
    const body = req.body;
    // console.log(body);
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const verifypassword = await bcrypt.compare(body.password, user.password);
    console.log("verifypassword", verifypassword);
    if (!verifypassword) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    const { accessToken, refreshToken } = generateUserToken(user);

    res
      .status(200)
      .json({ accessToken, refreshToken, msg: "user loggedin successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json([
      {
        res: error,
      },
    ]);
  }
};

const handleFetchuserList = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      res: error.message,
    });
  }
};

const handleRegenerateToken = async (req, res) => {
  try {
    const refreshtoken = req.headers["refreshtoken"];
    if (!refreshtoken) {
      return res
        .status(401)
        .json({ msg: "Access Denied. No refresh token provided." });
    }
    const decode = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    // console.log("de", decode);

    const payload = {
      _id: decode.id,
      email: decode.email,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    return res.status(200).json({ accessToken, msg: "token" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      res: error.message,
    });
  }
};

module.exports = {
  createUser,
  handleUserlogin,
  handleFetchuserList,
  handleRegenerateToken,
};
