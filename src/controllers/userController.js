const User = require("../models/user");
const client = require("../redis/redis");
const {generateUserToken, verifyRefreshToken} = require("../helper/jwt_helper");

const createUser = async (req, res) => {
  try {
    const payload = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = new User(payload); 
    // Password will hash in pre save method
    
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

    const verifypassword = await user.isValidPassword(body.password);

    if (!verifypassword) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = await generateUserToken(user);

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
    const decode = await verifyRefreshToken(refreshtoken);
 
    const user = {
      id: decode._id,
      email: decode.email,
    };

    const { accessToken, refreshToken } = await generateUserToken(user);
    return res.status(200).json({ accessToken, refreshToken, msg: "token generate successfully!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      res: error.message,
    });
  }
};

const handleLogout = async(req, res) => {
  try {
    const refreshtoken = req.headers["refreshtoken"];
    if (!refreshtoken) {
      return res
        .status(401)
        .json({ msg: "Access Denied. No refresh token provided." });
    }

    const user = await verifyRefreshToken(refreshtoken);
    await client.DEL(user._id);

    return res.status(200).json({  msg: "Logout Successfully!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      res: error.message,
    });
  }
}

module.exports = {
  createUser,
  handleUserlogin,
  handleFetchuserList,
  handleRegenerateToken,
  handleLogout
};
