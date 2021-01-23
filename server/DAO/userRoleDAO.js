const UserRole = require("../models/userRole");

class UserRoleDAO {

    static async getRoles(){
        return await UserRole.find();
    }

}

module.exports = {UserRoleDAO};