const mongoose = require('mongoose');

const designationSchema = mongoose.Schema({
    name: String
})

module.exports = mongoose.model('designation', designationSchema, 'designation');