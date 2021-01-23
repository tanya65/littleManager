const mongoose = require('mongoose');
const user = require('./user');

const payrollSchema = mongoose.Schema({
    date: Date,
    user: {type:mongoose.Schema.Types.ObjectId, ref: user},
    salary: Number,
    bonus: Number,
    sent: Boolean
})

module.exports = mongoose.model("payroll", payrollSchema, "payroll");