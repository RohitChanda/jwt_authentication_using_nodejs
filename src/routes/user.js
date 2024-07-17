const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createUser,
  handleUserlogin,
  handleFetchuserList,
  handleRegenerateToken,
} = require("../controllers/userController");

router.post("/create-user", createUser);
router.post("/login", handleUserlogin);
router.get("/users-list", authMiddleware, handleFetchuserList);
router.post("/refresh-token", handleRegenerateToken);

module.exports = router;
