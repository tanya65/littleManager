
const BASE_ADDRESS = "http://localhost:5000/designation/";

class DesignationAPI {

    static async getDesignations(){
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

    static async add(designation){
        let promise = await fetch(BASE_ADDRESS+"add",{
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            body: JSON.stringify(designation),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            timeout: 5000
        }).then(resp=>resp.json());
    
        return promise;
    }

}

export default DesignationAPI;


