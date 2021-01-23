import React, { Fragment } from 'react';
import UserAPI from '../api-client/user';
import {connect} from 'react-redux';
import { Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";

class EmployeesDashboard extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.loadEmployees();
    }

    render(){

        if (this.state.redirect === true) {
            return <Redirect push to={{ pathname: this.state.pathname }} />
          }

          return (
            <Fragment>
                {this.state.employees && this.state.employees.map((employee=>{
                    return (
                    <div style={{width:"100%",height:"50px",backgroundColor:"beige",margin:"5px 0"}} onClick={e=>this.navigate(employee._id)} key={employee._id}>
                        {employee.firstName + " " + employee.lastName + `\n`} 
                        {employee.team?.name + `\n`} 
                        {employee.salary }
                    </div>
                    )
                }))}

                <Button onClick={e=>this.navigate()}>Add New</Button>
            </Fragment>            
        )
    }

    navigate(userId){

        let pathname;

        if(userId) pathname = "/user/"+userId;
        else pathname = "/user/add";

        this.setState({redirect:true, pathname});
    }

    loadEmployees(){
        UserAPI.getUserDetails()
        .then(employees=>{
            this.setState({employees})
        })
    }

}

const mapStateToProps = data => {
    return { user: data.user};
}  

export default connect(mapStateToProps, null)(EmployeesDashboard);