const express = require("express");
router = express.Router();
const { body } = require("express-validator");
const {
  create_account,
  login,
  reviewPost,
  reviewCount,
  fetchHigestCountAggregate
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
router.post("/review", validateUserToken, reviewPost);
router.put("/countAdd/:reviewId", reviewCount);
router.get("/getReview", fetchHigestCountAggregate);

module.exports = router;

