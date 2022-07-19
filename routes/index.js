const express = require("express");
router = express.Router();
const { body } = require("express-validator");
const {
  create_account,
  login,
  fetchByAccountInfo,
  deposit,
  getStatement,
  withdraw
} = require("../controllers/index");

const { validateUserToken } = require("../lib/ath");

// route for authentication
router.post(
  "/create_account",
  body("accountname", "Name is required").trim(),
  body("password", "Password must be of  8 characters long and alphanumeric")
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric(),
  create_account
);
router.post("/login", login);
router.get("/getAccountInfo", validateUserToken, fetchByAccountInfo);
router.post("/deposit", validateUserToken, deposit);
router.get("/getStatement", validateUserToken, getStatement);
router.get("/withdraw", validateUserToken, withdraw);

module.exports = router;

