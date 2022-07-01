const Account = require("../models/account");
const accountNumber = require("../lib/tenDigit");
const CustomError = require("../lib/error");
const responseHandler = require("../utils/responseHandler");
const { validationResult, body } = require("express-validator");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
const { jwtSign } = require("../lib/ath");

//create user account
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
                    ` Initial deposit should be greater than 500`,
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

//login user
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
                    status: "success",
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

//get account info
exports.fetchByAccountInfo = async (req, res, next) => {
    try {
        const { accountnumber, password } = req.body
        const users = await Account.findOne({ accountnumber: accountnumber });
        if (users) {
            const account = await Account.find().select(["accountname", "deposit", "accountnumber"]);
            return res.status(200).json({
                status: "success",
                message: 'Account Info fetched succesfully',
                account,
            });
        } else {
            throw Error('Invalid account number or password',
                400);
        }
    } catch (error) {
        next(error);
    }
};

//deposit into account 
exports.deposit = async (req, res, next) => {
    try {
        const { accountnumber, deposit } = req.body;
        const user = await Account.findOne({ accountnumber: accountnumber });
        if (user) {
            const newDeposit = user.deposit + deposit;
            const updatedUser = await Account.findOneAndUpdate({ accountnumber: accountnumber }, { deposit: newDeposit });
            return res.status(200).json({
                status: "success",
                message: 'Deposit successful',
                deposit: newDeposit,
            });
        } else {
            throw Error('Invalid account number or password',
                400);
        }
    } catch (error) {
        next(error);
    }
}

//get account statement
exports.getStatement = async (req, res, next) => {
    try {
        const { accountnumber } = req.body;
        const user = await Account.findOne({ accountnumber: accountnumber });
        if (user) {
            const account = await Account.find().select(["accountname", "deposit", "accountnumber", "-createdAt"]);
            return res.status(200).json({
                status: "success",
                message: 'Account Info fetched succesfully',
                accountType: "deposit",
                account,
            });
        } else {
            throw Error('Invalid account number or password',
                400);
        }
    } catch (error) {
        next(error);
    }
}

//withdraw from account
exports.withdraw = async (req, res, next) => {
    try {
        const { accountnumber, withdraw } = req.body;
        const user = await Account.findOne({ accountnumber: accountnumber });
        if (user) {
            const newDeposit = user.deposit - withdraw;
            const updatedUser = await Account.findOneAndUpdate({ accountnumber: accountnumber }, { deposit: newDeposit });
            return res.status(200).json({
                status: "success",
                message: 'Withdraw successful',
                deposit: newDeposit,
            });
        } else {
            throw Error('Invalid account number or password',
                400);
        }
    } catch (error) {
        next(error);
    }
}