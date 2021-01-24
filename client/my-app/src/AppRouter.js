import React, { Component, Fragment } from 'react';
import { Switch,Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import LeavesDashboard from './pages/leavesDashboard';
import UserDetails from './pages/userDetails';
import Login from './pages/login';
import LeaveApplication from './components/leaveApplication';
import PageNotFound from './pages/pageNotFound';
import EmployeesDashboard from './pages/employeesDashboard';
import PayrollTracker from './pages/payrollTracker';

class AppRouter extends Component {

    constructor(props) {
      super(props);
    }

    componentDidMount(){
            let currentPath = window.location.pathname;
            if(currentPath=='' || currentPath=='/'){
              let redirectPath = this.props.user.id ? '/dashboard/employees':'/login';
              window.location.href = window.location.origin + redirectPath;
            }
    }

    render() {
        return (
          <Fragment>
            <Switch>

              <Route exact path='/login' render={() => {return(<Login/>)}} />
              {this.props.user.id?
              <Fragment>
              <Route path='/dashboard/leaves' render={() => {return (<LeavesDashboard/>)} } />
              <Route path='/leave' render={() => {return this.props?.user?.userRole?.role!="admin"? (<LeaveApplication/>):(<PageNotFound/>)} } />
              <Route path='/user' render={() => {return this.props?.user?.userRole?.role=="admin"? (<UserDetails/>):(<PageNotFound/>)} } />
              <Route path='/dashboard/employees' render={() => {return this.props?.user?.userRole?.role=="admin"? (<EmployeesDashboard/>):(<PageNotFound/>)} } />
              <Route path='/profile' render={() => {return (<UserDetails/>) }} />
              <Route path='/tracker/payroll' render={() => {return (<PayrollTracker/>) }} />
              <Route path='/logout' render={() => {this.logout();return (<Login/>) }} />
              </Fragment>
              :
              <Login/>
              }


            </Switch>

          </Fragment>
        );
    }

    logout(){
      sessionStorage.clear();
      this.props.updateUser({});
    }

}

const mapStateToProps = data => {
  return { user: data.user};
}  

const mapDispatchToProps = dispatch => {
  if(!dispatch) return;
  return {
      updateUser: (data) => dispatch({ type: "UPDATE_USER", user: data })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
