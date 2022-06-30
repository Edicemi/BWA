const initialDeposit = (deposit) => {
    if (deposit < 500) {
        return 'error';
    }
};

module.exports = initialDeposit();