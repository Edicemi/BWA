const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    accountnumber: {
        type: String,
        required: true,
    },
    accountname: {
        type: String,
        reqired: true,
    },
    password: {
        type: String,
        required: true,
    },
    deposit: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model('accounts', usersSchema);



