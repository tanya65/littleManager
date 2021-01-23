import React,{Fragment} from 'react';

import SignIn from '../components/signIn';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

class Login extends React.Component{

    constructor(props){
        super(props);
        this.state={
            redirect: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){}

    render(){
        if (this.props.user?.name) {
            return <Redirect push to={{ pathname:"/dashboard/employees"}} />
          }
       
        return (
            <Fragment>
                {
                    !this.props.user?.name && <SignIn></SignIn>                    
                }
            </Fragment>
        )
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Login);
 