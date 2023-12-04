const express = require("express");
const {
  register,
  login,
  getAllUsers,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/usersList", auth(), getAllUsers);
router.post("/register", register);
router.post("/login", login);
// router.patch("/update", auth(), updateDetails);
// router.delete("/delete", auth(), deleteUser);

module.exports = router;
