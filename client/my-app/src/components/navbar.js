import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import '../styles/navbar.scss';

class Navbar extends React.Component{

    constructor(props){
        super(props);

        let currentPath = window.location.pathname;
        this.state={currentPath}
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.pathname && prevState.pathname!=this.state.pathname){
            let currentPath = this.state.pathname;
            this.setState({pathname:null,currentPath})
        }
        if(this.props.user.id && prevProps.user.id!=this.props.user.id){
            let currentPath = "/dashboard/employees";
            this.setState({pathname:null,currentPath})
        }
    }

    render(){
            const navItem = {
                width:"100px",
                height:"100%",
                float:"right",
                margin:"0 5px",
                margin: "0px 5px",
                cursor: "pointer"
            }

        if(this.state.pathname) {
            return <Redirect push to={{pathname: this.state.pathname}} />
        }

        return (
            <div style={{width:"100%",height:"50px"}}>
               <div style={navItem} id={this.state.currentPath=="/profile"?'selected':''} onClick={e=>this.handleClick("profile")}>
                    <span className="item">My Profile</span>
               </div>
               <div style={navItem} id={this.state.currentPath=="/dashboard/leaves"?'selected':''} onClick={e=>this.handleClick("leaves")}>
                    <span className="item">Leaves</span>
               </div>
               <div style={navItem} id={this.state.currentPath=="/tracker/payroll"?'selected':''} onClick={e=>this.handleClick("payroll")}>
                    <span className="item">Payroll</span>
               </div>
               {this.props.user?.userRole?.role=="admin" &&
                <div style={navItem} id={this.state.currentPath=="/dashboard/employees"?'selected':''} onClick={e=>this.handleClick("employees")}>
                    <span className="item">Employees</span>
                </div>
               }
            </div>
        )
    }

    handleClick(page) {
      let pathname = '';
        switch(page){
            case "profile": pathname = "/profile"; break;
            case "leaves": pathname = "/dashboard/leaves"; break;
            case "employees": pathname = "/dashboard/employees"; break;
            case "payroll": pathname = '/tracker/payroll';break;
        }

        if(pathname){
            this.setState({pathname});
        }
    }

}

const mapStateToProps = data => {
    return { user: data.user};
  }  

  
export default connect(mapStateToProps, null)(Navbar);
  

