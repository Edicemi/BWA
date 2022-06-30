const Account = require("../models/account");
const accountNumber = require("../lib/tenDigit");
const CustomError = require("../lib/error");
const responseHandler = require("../utils/responseHandler");
const { validationResult, body } = require("express-validator");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
const { jwtSign } = require("../lib/ath");


exports.create_account = async (req, res, next) => {
    const { accountname, deposit, password } = req.body;
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new CustomError().check_input();
        }
        if (accountname && deposit && password) {
            let userExist = await Account.findOne({ accountname: accountname });
            if (userExist) {
                throw new CustomError(
                    `Account name ${accountname} already exist, try another one.`,
                    400
                );
            };
            if (deposit < 500) {
                throw new CustomError(
                    `Deposit should be greater than 500`,
                    400
                );
            }
            const hashedPassword = await passwordHash(password);
            const user = new Account({
                accountname: accountname,
                deposit: deposit,
                password: hashedPassword,
                accountnumber: accountNumber,
            });

    await user.save();
            return res.status(200).json({
                message: "Account created succesfully",
                code: 200,
                status: "success",
                accountNumber,
            });
        } else {
            throw new CustomError().invalid_parameter();
        }
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { accountnumber, password } = req.body;
    try {
        const user = await Account.findOne({ accountnumber: accountnumber });
        if (user) {
            const doMatch = await passwordCompare(password, user.password);
            if (doMatch) {
                let payload = {
                    user_id: user._id,
                    accountname: user.accountname,
                    accountnumber: user.accountnumber,
    
                };
                const token = jwtSign(payload);
                return res.status(200).json({
                    message: 'User logged in successfully',
                    status: status,
                    token,
                });
            } else {
                throw Error('Invalid account number or password',
                    410);
            }
        } else {
            throw Error('Invalid account number or password', 410);
        }
    } catch (error) {
        next(error);
    }
}
