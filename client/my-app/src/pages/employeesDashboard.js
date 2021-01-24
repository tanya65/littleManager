import React, { Fragment } from 'react';
import UserAPI from '../api-client/user';
import {connect} from 'react-redux';
import { Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import Badge from '../resources/badge.png';
import Coin from '../resources/dollar.png';
import Team from '../resources/group.png';
import Crown from '../resources/crown.png';
import Tooltip from '@material-ui/core/Tooltip';
import '../styles/employee-dashboard.scss';

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
                <div style={{ padding:"5px 25px", textAlign:"left", borderBottom:"1.5px solid #A0A0A0"}}>
                    <span style={{textAlign:"left", fontSize:"30px"}}>Employees</span>
                </div>
                <div style={{marginTop:"4vh"}}>
                    {this.state.employees && this.state.employees.map((employee=>{
                        return (
                        <div className="row" onClick={e=>this.navigate(employee._id)} key={employee._id}>
                            
                            <div className="cell name">
                                <div>{employee.firstName + " " + employee.lastName}</div>
                                {employee.userRole?.name=="admin" && 
                                    <Tooltip title="Admin" placement="top-end" arrow>
                                      <img src={Crown} className="icon"></img>
                                    </Tooltip>
                                }
                            </div>
                            <div className="cell other">
                                <div className="cell">
                                        <Tooltip title="Designation" placement="top-end" arrow>
                                        <div>
                                            <img src={Badge} className="icon m5"></img>
                                        </div>
                                        </Tooltip>
                                        <div style={{margin:"5px"}}>{employee.designation?.name}</div>
                                </div>
                                <div className="cell">
                                        <Tooltip title="Salary" placement="top-end" arrow>
                                        <div>
                                            <img src={Coin} className="icon m5"></img>
                                        </div>
                                        </Tooltip>
                                        <div style={{margin:"5px"}}>{employee.salary}</div> 
                                </div>
                                <div className="cell">
                                        <Tooltip title="Team" placement="top-end" arrow>
                                        <div>
                                            <img src={Team} className="icon m5"></img>
                                        </div>
                                        </Tooltip>
                                        <div style={{margin:"5px"}}>{employee.team?.name }</div> 
                                </div>
                            </div> 
                        </div>
                        )
                    }))}
                </div>

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