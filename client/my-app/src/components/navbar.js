import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

class Navbar extends React.Component{

    constructor(props){
        super(props);
        this.state={}
    }

    render(){
            const navItem = {
                width:"100px",
                backgroundColor:"yellow",
                height:"100%",
                float:"right",
                margin:"0 5px"
            }

        if(this.state.redirect) {
            this.setState({redirect:false})
            return <Redirect push to={{pathname: this.state.pathname}} />
        }

        return (
            <div style={{width:"100%",height:"50px",backgroundColor:"pink"}}>
               <div style={navItem} onClick={e=>this.handleClick("profile")}>
                    Profile: {this.props.user?.name}
               </div>
               <div style={navItem} onClick={e=>this.handleClick("leaves")}>
                    Leaves
               </div>
               <div style={navItem} onClick={e=>this.handleClick("payroll")}>
                    Payroll
               </div>
               {this.props.user?.userRole?.role=="admin" &&
                <div style={navItem} onClick={e=>this.handleClick("employees")}>
                    Employees
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
            this.setState({pathname, redirect:true});
        }
    }

}

const mapStateToProps = data => {
    return { user: data.user};
  }  

  
export default connect(mapStateToProps, null)(Navbar);
  

