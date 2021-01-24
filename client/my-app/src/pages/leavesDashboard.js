import { Button, ClickAwayListener } from '@material-ui/core';
import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import LeaveApplicationAPI from '../api-client/leaveApplication';
import '../styles/leaves-dashboard.scss';

import Tooltip from '@material-ui/core/Tooltip';
import PersonIcon from '@material-ui/icons/Person';
import DateRangeIcon from '@material-ui/icons/DateRange';
import NotesIcon from '@material-ui/icons/Notes';

var moment = require('moment');

class LeavesDashboard extends React.Component{

    constructor(props){
        super(props);
        this.state={leaves:[], openReasonTooltip:null};

        this.handleTooltipClose = this.handleTooltipClose.bind(this);
    }

    componentDidMount(){
        this.loadLeaveApplications();
    }

    loadLeaveApplications(){
        let userId = this.props.user?.userRole?.role=="admin" ? null : this.props.user?.id;
        LeaveApplicationAPI.getLeaveApplications(userId).then(leaves=> this.setState({leaves}))
    }

    render(){
        return (
            <Fragment>
                <div style={{ padding:"5px 25px", textAlign:"left", borderBottom:"1.5px solid #A0A0A0"}}>
                  <span style={{textAlign:"left", fontSize:"30px"}}>Leaves Tracker</span>
                </div>

                <div style={{marginTop:"4vh"}}>
                {this.state.leaves.map((leave, index)=>
                    <div key={index} className="row">
                        <div className="leave-cell detail">
                           
                            <div className="leave-cell name">
                                <PersonIcon style={{margin:"0 5px"}} />
                                <div>{leave.user?.firstName + " " + (leave.user?.lastName || '')}</div>
                            </div>
                            <div className="leave-cell date">
                                <DateRangeIcon className="dateIcon"/>
                                <div className="sub-cell">
                                    <div className=".m5" style={{display:"flex", justifyContent:"space-between"}}><div> From:</div> <div><b>{this.formatDate(leave.fromDate)}</b></div> </div>
                                    <div className=".m5" style={{display:"flex", justifyContent:"space-between"}}><div> To: </div><div><b>{this.formatDate(leave.toDate)}</b></div> </div>
                                </div>
                            </div>
                            <ClickAwayListener onClickAway={this.handleTooltipClose}>
                                <Tooltip PopperProps={{ disablePortal: true}} onClose={this.handleTooltipClose} open={this.state.openReasonTooltip==index}
                                disableFocusListener disableHoverListener disableTouchListener title={leave.reason}>
                                    <div className="leave-cell reason" onClick={e=>this.handleTooltipOpen(index)}>
                                        <NotesIcon className="dateIcon"/>
                                        <div className="sub-cell">Reason: &nbsp;{leave.reason || ''}</div>
                                    </div>
                                </Tooltip>
                            </ClickAwayListener>
                        </div>
                        <div className="leave-cell action">
                            {
                                leave.status=="requested"?
                                <Fragment>
                                    <Button className="action-button reject" onClick={e=>this.changeLeaveStatus(leave,false,index)}>Reject</Button>
                                    <Button className="action-button approve" onClick={e=>this.changeLeaveStatus(leave,true,index)}>Approve</Button>
                                </Fragment>
                            :   <Fragment>
                                    <Button className="action-button undo" onClick={e=>this.changeLeaveStatus(leave,null,index)}>Change status</Button>
                                </Fragment>
                            }
                        </div>
                    </div>
                )}
            </div>
            </Fragment>
        )
    }

    handleTooltipClose(e){
        let classname = e.target.className.trim();
        if(classname!="leave-cell reason" && classname!="sub-cell") {
            this.setState({openReasonTooltip:null});
        }
    }

    handleTooltipOpen(index){
        this.setState({openReasonTooltip:index});
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
 