const BASE_ADDRESS = "http://localhost:5000/userRole/";

class UserRoleAPI{

    static async getUserRoles(){
        let promise = await fetch(BASE_ADDRESS,{
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

export default UserRoleAPI;