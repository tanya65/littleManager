const mongoose = require('mongoose');
const Payroll = require("../models/payroll");
const User = require("../models/user");
const ObjectId = mongoose.Types.ObjectId;

class PayrollDAO {

    static async savePayroll(payroll){
        payroll._id = payroll._id || ObjectId();
        let updatedPayroll = await Payroll.findByIdAndUpdate(payroll._id, {$set: payroll}, { new: true, upsert: true }).populate("user");
        if(!updatedPayroll) throw "Couldn't save/update payroll";
        return updatedPayroll;

    }

    static async getPayrollsForPeriod(fromDate, toDate, excludeUnsentPayrolls){
        toDate = toDate || new Date();
        fromDate = fromDate || new Date(toDate.setFullYear(toDate.getFullYear-50));

        let predicate = {date : {$lte: toDate, $gte:fromDate}} ;
        let payrolls =  await Payroll.find(predicate).populate("user");

        if(!excludeUnsentPayrolls) {
            let arr = [];
            payrolls.forEach(element => {
                arr.push(element.user._id)
            });
            let employees =  await User.find({_id: {$nin: arr}});
            for(let item of employees){
                payrolls.push({user:item, salary:item.salary, sent:false});
            }
        }

        return payrolls;
    }

    // static async getEmployeesWithUnsentPayrollsForPeriod(fromDate, toDate){
    //     toDate = toDate || new Date();
    //     fromDate = fromDate || new Date(toDate.setFullYear(toDate.getFullYear-50));

    //     let predicate = {date : {$lte: toDate, $gte:fromDate}} ;
    //     let ids = await Payroll.find(predicate, 'user -_id');
    //     let arr = [];
    //     ids.forEach(element => {
    //         arr.push(element.user)
    //     });
    //     let employees =  await User.find({_id: {$nin: arr}});
    //     return employees;
    // }

}

module.exports = {PayrollDAO};