import React, { Fragment } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {connect} from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import {createMuiTheme, ThemeProvider, Button, TextField} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import PersonIcon from '@material-ui/icons/Person';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';

import '../styles/leaves-dashboard.scss';
import '../styles/payroll-tracker.scss';

import PayrollAPI from "../api-client/payroll";
var moment = require('moment');

const materialTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#00FFFF',
        contrastText: '#fff'
      }
    }
  });

class PayrollTracker extends React.Component{

    constructor(props){
        super(props);
        this.state={
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),
            payrolls: [],
        };
    }

    componentDidMount(){
        this.loadPayrolls();
    }

    componentDidUpdate(prevProps, prevState){

        if(prevState.fromDate!=this.state.fromDate || prevState.toDate!=this.state.toDate){
            this.loadPayrolls();
        }

    }

    loadPayrolls(){
        let period = {};
        period.fromDate = this.state.fromDate;
        period.toDate = this.state.toDate;
        PayrollAPI.getPayrollForPeriod(period)
        .then(payrolls=>{
           this.setState({payrolls})
        })
    }

    render(){
        let that = this;
        return (
            <Fragment>

                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={this.state.openMessage ? true : false}
                    autoHideDuration={2000}
                    TransitionComponent={Slide}
                    onClose={() => this.closePopup()}>
                    <MuiAlert elevation={4} variant="filled" onClose={() => this.closePopup()} severity={this.state.messageVariant}>
                        {this.state.message}
                    </MuiAlert>
                </Snackbar>

                <div style={{ marginBottom:"4vh", padding:"5px 25px", textAlign:"left", borderBottom:"1.5px solid #A0A0A0"}}>
                    <span style={{textAlign:"left", fontSize:"30px"}}>Payroll Tracker</span>
                </div>

                <div>
                    <div style={{display:"flex", paddingLeft:"13px"}}>
                    <ThemeProvider theme={materialTheme}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} >
                            <DatePicker className="actionText field payroll"
                            autoOk={true}
                            // variant={this.props.width === 'xs' ? "dialog":"inline"}
                            format="MMM dd, yyyy"
                            views={["year", "month", "date"]}
                            label="From"
                            value={this.state.fromDate ? (typeof this.state.fromDate === "string" ? new Date(this.state.fromDate):this.state.fromDate) : null}
                            onChange={(date) => this.setState({fromDate:date})}
                            >
                            </DatePicker>
                        </MuiPickersUtilsProvider>

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker className="actionText field payroll"
                            autoOk={true}
                            // variant={this.props.width === 'xs' ? "dialog":"inline"}
                            format="MMM dd, yyyy"
                            views={["year", "month", "date"]}
                            label="To"
                            value={this.state.toDate ? (typeof this.state.toDate === "string" ? new Date(this.state.toDate):this.state.toDate) : null}
                            onChange={(date) => this.setState({toDate:date})}>
                            </DatePicker>
                        </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </div>

                {
                    this.state.payrolls?.map((item, index)=> {
                    
                        if(that.props.user?.id==item.user._id) return ;
                        
                        return (<div className="row" key={index}>
                            
                            <div className="leave-cell detail">
                                <div className="leave-cell name payroll" >
                                    <PersonIcon style={{margin:"0 5px"}} />
                                    <div>{item.user?.firstName + " " + item.user?.lastName}</div>
                                </div>
                                <div  className="leave-cell payroll">
                                    <ThemeProvider theme={materialTheme}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker className="actionText field sub-cell"
                                        autoOk={true}
                                        disabled={item.sent?true:false}
                                        // variant={this.props.width === 'xs' ? "dialog":"inline"}
                                        format="MMM dd, yyyy"
                                        views={["year", "month", "date"]}
                                        label="Date"
                                        value={item.date ? (typeof item.date === "string" ? new Date(item.date): item.date) : null}
                                        onChange={(date) => this.handleUpdate('date', date, index)}>
                                        </DatePicker>
                                    </MuiPickersUtilsProvider>
                                    </ThemeProvider>
                                </div>
                                <div className="leave-cell payroll salary"> 
                                    <div className="sub-cell">
                                        <div>
                                            <NumberFormat disabled={item.sent?true:false} required placeholder="eg 1,000" label="salary" value={parseFloat(item.salary) || ""} onValueChange={e=>this.handleUpdate('salary', e.value, index)} allowNegative={false}
                                            thousandSeparator={true} customInput={TextField} className="field" key={0} />
                                        </div>
                                        <div>
                                            <NumberFormat required disabled={item.sent?true:false} laceholder="eg 1,000" label="bonus" value={parseFloat(item.bonus) || ""} onValueChange={e=>this.handleUpdate('bonus', e.value, index)} allowNegative={false}
                                            thousandSeparator={true} customInput={TextField} className="field" key={0} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                            </div>                        
                            </div>
                            <div className="leave-cell action payroll">
                                <Button onClick={e=>this.changePayStatus(item,!item.sent,index)} className={item.sent?'undo action-button payroll':'approve action-button payroll'}>{item.sent? 'Mark Unsent': 'Save and Mark Sent'}</Button>
                            </div>
                        </div>
                    )}

                )}
               
               </div>
            </Fragment>
        )
    }

     //snackbar
     closePopup = () => {
        this.setState({ message: "", openMessage: false });
    }

    handleUpdate(item, value, index) {
        let payrolls = this.state.payrolls;
        payrolls[index][item] = item=='date'? this.formatDate(value):value;
        this.setState({payrolls});
    }

    changePayStatus(payroll, isApproved, index){
        
        if(!payroll.date) {
            this.setState({message: "Oops! It helps to have a date", openMessage: true, messageVariant:"warning"})
            return;
        }
        else if(!payroll.salary){
            this.setState({message: "Oops! Salary is missing", openMessage: true, messageVariant:"warning"})
            return;
        }

        if(isApproved) payroll.sent = true;
        else payroll.sent = false;

        PayrollAPI.savePayroll(payroll)
            .then(savedPayroll=>{
                console.log("savedPayroll: ",savedPayroll);
                let payrolls = this.state.payrolls;
                payrolls[index] = savedPayroll;

                //save updated payroll in state
                this.setState({payrolls, message: "Successfully saved transaction!", openMessage: true, messageVariant:"success"});
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
  
export default connect(mapStateToProps)(PayrollTracker);
 