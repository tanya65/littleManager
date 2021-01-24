const mongoose = require('mongoose');
const User = require("../models/user");
const ObjectId = mongoose.Types.ObjectId;

class UserDAO {
    
     static async addUser(userDetails){

        let user = await User.findByIdAndUpdate(ObjectId(userDetails._id), {$set: userDetails},  {new:true, upsert: true});

        if(!user) throw "err! couldn't add user";
        return user;
    }

    static async findUserByUsername(username){

        let user = await User.findOne({'userName': username}, 'firstName lastName name userRole userName').populate('userRole', 'name -_id')
    
        return user;
    }


    static async getUsers(userId){
        let predicate = userId && userId!="all" ? {_id:ObjectId(userId)}:{};
        let users = await User.find(predicate).populate('userRole team designation');
        return users;
    }


}

module.exports = {UserDAO};
