const Designation = require("../models/designation");

class DesignationDAO {

    static async getDesignations(){
        return await Designation.find();
    }

    static async addDesignation(newDesignation){
        let designation = new Designation(newDesignation);
        designation = await designation.save();
        if(!designation) throw "Couldn't add designation";
        return designation;
    }

}

module.exports = {DesignationDAO};