"use strict";

var jwt = require('jsonwebtoken');

require("dotenv").config();

var CustomError = require('../lib/error'); // console.log("SIGN", process.env.JWT_SECRET_KEY)


var jwtSign = function jwtSign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 60
  });
};

var jwtVerify = function jwtVerify(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return false;
  }
};

var validateUserToken = function validateUserToken(req, res, next) {
  try {
    var authHeader = req.headers.authorization;
    var result;

    if (authHeader) {
      var token = req.headers.authorization.split(' ')[1];
      result = jwtVerify(token);

      if (!result) {
        throw Error('Invaled bearer token', 404);
      } else {
        req.decoded = result;
        console.log("this is from the result", result);
        next();
      }
    } else {
      throw Error('Authorization Header is required', 404);
    }
  } catch (err) {
    return res.status(500).json({
      error: err
    });
  }
};

module.exports = {
  jwtSign: jwtSign,
  jwtVerify: jwtVerify,
  validateUserToken: validateUserToken
};