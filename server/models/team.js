const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: String
})

module.exports = mongoose.model("team", teamSchema, "team");