
const BASE_ADDRESS = "http://localhost:5000/auth/";

class AuthAPI {

    static async authenticate(user){
        let promise = await fetch(BASE_ADDRESS,{
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            body: JSON.stringify({username:user.username}),
            headers: {
                'Authorization': user.tokenId,
                "Accept": "application/json",
                "Content-Type": "application/json"},
            timeout: 5000
        }).then(resp=>resp.json());
    
        return promise;
    }

}

export default AuthAPI;


