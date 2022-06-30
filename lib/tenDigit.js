const generateTenDigits = () => {
    return Math.floor(Math.random() * (10000000 - 9999999999 + 1) + 9999999999);
};
module.exports = generateTenDigits();