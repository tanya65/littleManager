import React from 'react';
import {GoogleLogin} from 'react-google-login';
import AuthAPI from '../api-client/auth';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';

const clientId = "639816459938-190vsnfaqbroegirj6jtiadctki8t9pl.apps.googleusercontent.com";

function SignIn(props){

    return(
        <div>
            <GoogleLogin
            clientId={clientId}
            buttonText="Login here"
            onSuccess={onSuccess}
            onFailure={onFailure}
            >
            </GoogleLogin>
            <Button onClick={handleClick}>click me</Button>
        </div>
    )

    function handleClick(){
        sessionStorage.setItem('token',"xyz-bogusToken");
        props.updateUser({name:"bogus", id: "5ffa8bf5c22bf4999335b3f6", userRole:{role:"admin"}});
    }

    function onSuccess(res){
        let username = res.profileObj?.email;
        let tokenId = res.tokenId;
        sessionStorage.setItem('token',tokenId);
        if(!username) console.log("err! username is null");
        let user = {username,tokenId}
        
        AuthAPI.authenticate(user)
        .then(user=>{
        if(user){
            let loggedInUser = {};
            loggedInUser.name = user.firstName + (user.secondName || '');
            loggedInUser.id = user._id;
            loggedInUser.userRole = {role:user.userRole.name};
            loggedInUser.userName = user.userName;
            sessionStorage.setItem('username',loggedInUser.userName);
            props.updateUser(loggedInUser);
            }
        })
        .catch(err=>{
            console.log("authentication failed!", err);
        })
    }

    function onFailure(res){
        console.log("on failure", res);
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
  