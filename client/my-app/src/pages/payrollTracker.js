import React, { Fragment } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import {createMuiTheme, ThemeProvider, Button, TextField} from '@material-ui/core';
import NumberFormat from 'react-number-format';


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

    // loadEmployeesWithUnsentPayrolls(){
    //     let period = {};
    //     period.fromDate = this.state.fromDate;
    //     period.toDate = this.state.toDate;
    //     PayrollAPI.getEmployeesWithUnsentPayrolls(period)
    //     .then(employees=>{
    //         let unsentPayrolls = [];
    //         for(let employee of employees){
    //             unsentPayrolls.push({user:employee, salary:employee.salary});
    //         }
    //         this.setState({unsentPayrolls});
    //     })
    // }

    render(){
        return (
            <Fragment>
                 <ThemeProvider theme={materialTheme}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker className="actionText field"
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
                        <DatePicker className="actionText field"
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

                {
                    this.state.payrolls?.map((item, index)=>
                        <div key={index}>
                            <div>
                                name: {item.user?.firstName + " " + item.user?.lastName}
                            </div>
                            <div>

                                <ThemeProvider theme={materialTheme}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker className="actionText field"
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
                            <div>
                                <NumberFormat disabled={item.sent?true:false} required placeholder="eg 1,000" label="salary" value={parseFloat(item.salary) || ""} onValueChange={e=>this.handleUpdate('salary', e.value, index)} allowNegative={false}
                                thousandSeparator={true} customInput={TextField} className="field" key={0} />
   
                            </div>
                            <div>
                                <NumberFormat required disabled={item.sent?true:false} laceholder="eg 1,000" label="bonus" value={parseFloat(item.bonus) || ""} onValueChange={e=>this.handleUpdate('bonus', e.value, index)} allowNegative={false}
                                thousandSeparator={true} customInput={TextField} className="field" key={0} />
                            </div>
                            <div>
                         
                            <Fragment>
                                <Button onClick={e=>this.changePayStatus(item,!item.sent,index)} style={{backgroundColor: !item.sent?'pink':''}}>{item.sent? 'Mark Unsent': 'Save and Mark Sent'}</Button>
                            </Fragment>
                        
                            </div>
                            <hr></hr>
                        </div>
                        )
                }
               

            </Fragment>
        )
    }

    handleUpdate(item, value, index) {
        let payrolls = this.state.payrolls;
        payrolls[index][item] = item=='date'? this.formatDate(value):value;
        this.setState({payrolls});
    }

    changePayStatus(payroll, isApproved, index){
        
        if(!payroll.date) {
            console.log("select a date");
            return;
        }
        else if(!payroll.salary){
            console.log("Please fill the salary");
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
                this.setState({payrolls});
            })

    }

    formatDate(date){
        if(!date) date = new Date();
        return moment(date, moment.ISO_8601).format("YYYY-MM-DD");    
    }

}

export default PayrollTracker;