"use strict";

var Account = require("../models/account");

var randtoken = require("rand-token");

var CustomError = require("../lib/error");

var responseHandler = require("../utils/responseHandler");

var _require = require("express-validator"),
    validationResult = _require.validationResult,
    body = _require.body;

var _require2 = require("../lib/bcrypt"),
    passwordHash = _require2.passwordHash,
    passwordCompare = _require2.passwordCompare;

var _require3 = require("../lib/ath"),
    jwtSign = _require3.jwtSign;

exports.create_account = function _callee(req, res, next) {
  var _req$body, accountname, deposit, password, Token, result, userExist, _deposit, hashedPassword, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, accountname = _req$body.accountname, deposit = _req$body.deposit, password = _req$body.password;
          Token = randtoken.generate(20);
          _context.prev = 2;
          result = validationResult(req);

          if (result.isEmpty()) {
            _context.next = 6;
            break;
          }

          throw new CustomError().check_input();

        case 6:
          if (!(accountname && deposit && password)) {
            _context.next = 22;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(Account.findOne({
            accountname: accountname
          }));

        case 9:
          userExist = _context.sent;

          if (!userExist) {
            _context.next = 12;
            break;
          }

          throw new CustomError("Account name ".concat(accountname, " already exist, try another one."), 400);

        case 12:
          _deposit = function _deposit(number) {
            if (number < 500) {
              return 'error';
            }
          };

          _context.next = 15;
          return regeneratorRuntime.awrap(passwordHash(password));

        case 15:
          hashedPassword = _context.sent;
          user = new Account({
            accountname: accountname,
            deposit: _deposit,
            password: hashedPassword,
            accountnumber: Token
          });
          _context.next = 19;
          return regeneratorRuntime.awrap(user.save());

        case 19:
          return _context.abrupt("return", res.status(200).json({
            message: "Account created succesfully",
            status: true,
            Token: Token
          }));

        case 22:
          throw new CustomError().invalid_parameter();

        case 23:
          _context.next = 28;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](2);
          next(_context.t0);

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 25]]);
};