import React from 'react';
import MaterialUIForm from 'material-ui-form';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import {DatePicker} from '@material-ui/pickers';
import {createMuiTheme, ThemeProvider, Button, TextField} from '@material-ui/core';

import LeaveApplicationAPI from '../api-client/leaveApplication';

const materialTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#00FFFF',
        contrastText: '#fff'
      }
    }
  });

class LeaveApplication extends React.Component{

    constructor(props){
        super(props);
        this.state={
            fromDate:new Date(),
            toDate:new Date()
        };

        this.submitForm = this.submitForm.bind(this);
    }

    render(){
        return (
            <div>

                <h2>Application for leave</h2>
                <MaterialUIForm onSubmit={this.submitForm}>
                <div className="form-body"> 
                   
                    <ThemeProvider theme={materialTheme}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker className="actionText field"
                        disablePast
                        autoOk={true}
                        // variant={this.props.width === 'xs' ? "dialog":"inline"}
                        format="MMM dd, yyyy"
                        views={["year", "month", "date"]}
                        label="From"
                        value={this.state.fromDate ? (typeof this.state.fromDate === "string" ? new Date(this.state.fromDate):this.state.fromDate) : new Date()}
                        onChange={(date) => this.setState({fromDate:date})}
                        >
                        </DatePicker>
                    </MuiPickersUtilsProvider>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker className="actionText field"
                        autoOk={true}
                        // variant={this.props.width === 'xs' ? "dialog":"inline"}
                        format="MMM dd, yyyy"
                        views={["year", "month", "date"]}
                        label="To"
                        value={this.state.toDate ? (typeof this.state.toDate === "string" ? new Date(this.state.toDate):this.state.toDate) : new Date()}
                        onChange={(date) => this.setState({toDate:date})}>
                        </DatePicker>
                    </MuiPickersUtilsProvider>
                    </ThemeProvider>

                    <TextField className="field" label="Reason for leave" onChange={e=>this.setState({reason:e.target.value})}/>
                
                </div>
                <Button variant="contained" type="submit"> Apply for leave </Button>

                </MaterialUIForm>
            </div>
        )
    }

    submitForm(){
        let leaveApplication = {};
        leaveApplication.fromDate = this.state.fromDate;
        leaveApplication.toDate = this.state.toDate;
        leaveApplication.reason = this.state.reason;

        LeaveApplicationAPI.add(leaveApplication).then(resp=>{
            console.log("success! Applied for leave");
        })
    }

}

export default LeaveApplication;