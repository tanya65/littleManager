const mongoose = require('mongoose');
const Leave = require("../models/leave");
const ObjectId = mongoose.Types.ObjectId;

class LeaveDAO {

    static async addLeaveApplication(newLeave){
        let leave = new Leave(newLeave);
        leave = await leave.save();
        if(!leave) throw "Couldn't save leave application";
        return leave;
    }

    static async getLeaveApplications(userId){
        let predicate = userId ? {user:ObjectId(userId)} : {};
        let leaves =  await Leave.find(predicate).populate("user");
        console.log(leaves);
        return leaves;
    }

    static async updateLeave(leave){
        let updatedLeave = await Leave.findByIdAndUpdate(ObjectId(leave._id), {$set: leave} ,{ new: true, upsert: false });
        if(!updatedLeave) throw "Couldn't update leave";
        return updatedLeave;
    }

}

module.exports = {LeaveDAO};