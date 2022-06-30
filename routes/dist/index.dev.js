"use strict";

var express = require("express");

router = express.Router();

var _require = require("express-validator"),
    body = _require.body;

var _require2 = require("../controllers/index"),
    create_account = _require2.create_account; // const { validateUserToken } = require("../lib/ath");
// route for authentication


router.post("/create_account", body("accountname", "Name is required").trim(), body("password", "Password must be of  8 characters long and alphanumeric").trim().isLength({
  min: 8
}).isAlphanumeric(), create_account);
module.exports = router;