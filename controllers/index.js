// //generate 10 random numbers



// //return error is number is less than 500

const Account = require("../models/account");
const CustomError = require("../lib/error");
const responseHandler = require("../utils/responseHandler");
const { validationResult, body } = require("express-validator");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
const { jwtSign } = require("../lib/ath");


exports.create_account = async (req, res, next) => {
    const { accountname, deposit, password, accountnumber } = req.body;
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new CustomError().check_input();
        }
        if (accountname && deposit && password && accountnumber) {
            let userExist = await Account.findOne({ accountname: accountname });
            if (userExist) {
                throw new CustomError(
                    `Accountname ${accountname} already exist, try another one.`,
                    400
                );
            }
            const myNumber = () => {
                return Math.floor(Math.random() * 10);
            };

            const deposit = (number) => {
                if (number < 500) {
                    return 'error';
                }
            };

            const hashedPassword = await passwordHash(password);
            const user = new User({
                accountname: accountname,
                deposit: deposit,
                password: hashedPassword,
                accountnumber: myNumber,
            });

    await user.save();
            return responseHandler(res, 200, "User account created succesfully.");

        } else {
            throw new CustomError().invalid_parameter();
        }
    } catch (error) {
        next(error);
    }
};
