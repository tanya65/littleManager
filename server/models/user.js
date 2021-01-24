const mongoose = require('mongoose');
const team = require('./team');
const userRole = require('./userRole');
const designation = require('./designation');

const userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    userName:String,
    team: {type:mongoose.Schema.Types.ObjectId, ref: team},
    salary: Number,
    userRole: {type:mongoose.Schema.Types.ObjectId, ref: userRole},
    designation: {type:mongoose.Schema.Types.ObjectId, ref: designation}
})

module.exports = mongoose.model('user',userSchema,'user');