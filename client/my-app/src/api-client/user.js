
const BASE_ADDRESS = "http://localhost:5000/user/";

class UserAPI {

    static async addUser(user){
        let promise = await fetch(BASE_ADDRESS+"add",{
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            body: JSON.stringify(user),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            timeout: 5000
        }).then(resp=>resp.json());
    
        return promise;
    }

    static async getUserDetails(userId){
        let url = BASE_ADDRESS + (userId ?? 'all'); 
        let promise = await fetch(url,{
            method: 'GET',
            credentials: 'include',
            redirect: 'follow',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            timeout: 5000
        }).then(resp=>resp.json());
    
        return promise;
    }

}

export default UserAPI;


