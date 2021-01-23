import { Button } from '@material-ui/core';
import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import LeaveApplicationAPI from '../api-client/leaveApplication';
var moment = require('moment');

class LeavesDashboard extends React.Component{

    constructor(props){
        super(props);
        this.state={leaves:[]};
    }

    componentDidMount(){
        this.loadLeaveApplications();
    }

    loadLeaveApplications(){
        let userId = this.props.user?.userRole?.role=="admin" ? null : this.props.user?.id;
        LeaveApplicationAPI.getLeaveApplications(userId).then(leaves=> this.setState({leaves}))
    }

    render(){
        console.log("leaves dashboard", this.props.user);
        return (
            <div style={{backgroundColor:"yellowgreen"}}>
                {this.state.leaves.map((leave, index)=>
                    <Fragment key={index}>
                        <div>
                            applicant: {leave.user?.firstname + leave.user?.lastname || '-' }
                        </div>
                        <div>
                            from: {this.formatDate(leave.fromDate)}
                        </div>
                        <div>
                            to: {this.formatDate(leave.toDate)}
                        </div>
                        <div>
                            Reason: {leave.reason || ''}
                        </div>
                        <div>
                            {
                                leave.status=="requested"?
                                <Fragment>
                                    <Button onClick={e=>this.changeLeaveStatus(leave,true,index)}>Approve</Button>
                                    <Button onClick={e=>this.changeLeaveStatus(leave,false,index)}>Reject</Button>
                                </Fragment>
                            :   <Fragment>
                                    <Button onClick={e=>this.changeLeaveStatus(leave,null,index)}>Change status</Button>
                                </Fragment>
                            }
                        </div>
                       
                        <hr></hr>
                    </Fragment>
                )}
            </div>
        )
    }

    changeLeaveStatus(leave, isApproved, index){
        if(leave.status=="requested"){
            leave.status = isApproved? "approved":"rejected";
        }
        else leave.status = "requested";

        LeaveApplicationAPI.update(leave)
        .then(resp=>{

            let leaves = [].concat(this.state.leaves);
            leaves.splice(index,1, leave);
    
            console.log("leaves",leaves);
            this.setState({leaves});
        })

    }

    formatDate(date){
        if(!date) date = new Date();
        return moment(date, moment.ISO_8601).format("YYYY-MM-DD");    
    }
}

const mapStateToProps = data => {
    return { user: data.user};
  }  
  
export default connect(mapStateToProps)(LeavesDashboard);
 