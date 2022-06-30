// //generate 10 random numbers
// const randomNumber = () => {
//     return Math.floor(Math.random() * 10);
// }


// //return error is number is less than 500
// const error = (number) => {
//     if (number < 500) {
//         return 'error';
//     }
// }

const path = require("path");
const Account = require("../models/account");
const CustomError = require("../lib/error");
const responseHandler = require("../utils/responseHandler");
const { validationResult, body } = require("express-validator");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
const { jwtSign } = require("../lib/ath");
const { uploadCloudinary } = require("../lib/cloudinary");

const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

exports.signUp = async (req, res, next) => {
    const { fullname, email, password } = req.body;
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new CustomError().check_input();
        }
        if (fullname && email && password) {
            let userExist = await User.findOne({ email: email });
            if (userExist) {
                throw new CustomError(
                    `Email ${email} already exist, try another one.`,
                    400
                );
            }
            const hashedPassword = await passwordHash(password);
            const user = new User({
                fullname: fullname,
                email: email,
                password: hashedPassword,
            });

            await user.save();
            return responseHandler(res, 201, "User account created succesfully.");

        } else {
            throw new CustomError().invalid_parameter();
        }
    } catch (error) {
        next(error);
    }
};
