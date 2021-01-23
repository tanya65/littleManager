
const BASE_ADDRESS = "http://localhost:5000/payroll/";

class PayrollAPI {

    static async savePayroll(payroll){
        let promise = await fetch(BASE_ADDRESS+"save",{
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            body: JSON.stringify({payroll}),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            timeout: 5000
        }).then(resp=>resp.json());
    
        return promise;
    }


    // static async deletePayroll(payrollId){
    //     let promise = await fetch(BASE_ADDRESS+payrollId+"/delete/",{
    //         method: 'GET',
    //         credentials: 'include',
    //         redirect: 'follow',
    //         headers: {
    //             "Accept": "application/json",
    //             "Content-Type": "application/json"},
    //         timeout: 5000
    //     }).then(resp=>resp.json());
    
    //     return promise;
    // }

    static async getPayrollForPeriod(dates, excludeUnsentPayrolls){
        let url = BASE_ADDRESS;
        if(excludeUnsentPayrolls) url = url + '?excludeUnsentPayrolls=true';
        let promise = await fetch( url ,{
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            body: JSON.stringify(dates),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            timeout: 5000
        }).then(resp=>resp.json());
    
        return promise;
    }

    // static async getEmployeesWithUnsentPayrolls(dates){
    //     let promise = await fetch(BASE_ADDRESS + 'unsent',{
    //         method: 'POST',
    //         credentials: 'include',
    //         redirect: 'follow',
    //         body: JSON.stringify(dates),
    //         headers: {
    //             "Accept": "application/json",
    //             "Content-Type": "application/json"},
    //         timeout: 5000
    //     }).then(resp=>resp.json());
    
    //     return promise;
    // }

}

export default PayrollAPI;


