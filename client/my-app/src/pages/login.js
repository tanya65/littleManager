import React,{Fragment} from 'react';

import SignIn from '../components/signIn';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import AuthAPI from '../api-client/auth';

class Login extends React.Component{

    constructor(props){
        super(props);
        this.state={
            redirect: false
        }
    }

    componentDidMount(){
        let username = sessionStorage.getItem('username');
        let tokenId = sessionStorage.getItem('token');
        let user = {username,tokenId}

        if(!this.props.user.id && username && username!="undefined" && tokenId) {
            this.authenticate(user);                     
        }
    }

    authenticate(user){

        AuthAPI.authenticate(user)
        .then(user=>{
        if(user){
            let loggedInUser = {};
            loggedInUser.name = user.firstName + (user.secondName || '');
            loggedInUser.id = user._id;
            loggedInUser.userRole = {role:user.userRole.name};
            loggedInUser.userName = user.userName;
            this.props.updateUser(loggedInUser);
        }
        })
        .catch(err=>{
            console.log("authentication failed!", err);
        })
    }

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
 