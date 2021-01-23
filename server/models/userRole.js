const mongoose = require('mongoose');

const userRoleSchema = mongoose.Schema({
    role: String
})

module.exports = mongoose.model('userRole', userRoleSchema, 'userRole');
