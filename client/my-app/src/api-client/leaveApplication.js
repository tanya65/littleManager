
const BASE_ADDRESS = "http://localhost:5000/leave/";

class LeaveApplicationAPI {

    static async add(leave){
        let promise = await fetch(BASE_ADDRESS+"add",{
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            body: JSON.stringify(leave),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            timeout: 5000
        }).then(resp=>resp.json());
    
        return promise;
    }

    static async getLeaveApplications(userId){
        let url = BASE_ADDRESS + (userId ? 'user/'+userId : '');
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

    static async update(leave){
        let promise = await fetch(BASE_ADDRESS+"update",{
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            body: JSON.stringify(leave),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            timeout: 5000
        });
    
        return promise;
    }

}

export default LeaveApplicationAPI;


