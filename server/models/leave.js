const mongoose = require('mongoose');
const user = require('./user');

const leaveSchema = mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: user},
    fromDate: Date,
    toDate: Date,
    reason: String,
    status: String
})

module.exports = mongoose.model("leave", leaveSchema, "leave");