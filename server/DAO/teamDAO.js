const Team = require("../models/team");

class TeamDAO {

    static async getTeams(){
        return await Team.find();
    }

    static async addTeam(newTeam){
        let team = new Team(newTeam);
        team = await team.save();
        if(!team) throw "Couldn't add team";
        return team;
    }

}

module.exports = {TeamDAO};