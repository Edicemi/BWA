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
