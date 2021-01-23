import React from 'react';
import {GoogleLogin} from 'react-google-login';
import AuthAPI from '../api-client/auth';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';


function SignIn(props){

  function onSuccess(res){
      console.log("profile user:", res);
      let username = res.profileObj?.email;
      let tokenId = res.tokenId;
      sessionStorage.setItem('token',tokenId);
      if(!username) console.log("err! username is null");
      let user = {username,tokenId}
      
      AuthAPI.authenticate(user)
      .then(user=>{
          console.log("success!", user);
          sessionStorage.setItem('user',user[0]);
          if(user) props.updateUser(user[0]);
      })
      .catch(err=>{
          console.log("authentication failed!", err);
      })
    }

  function onFailure(res){
      console.log("on failure", res);
  }
  console.log("redux user:", props.user);

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
      console.log("clicked");
      sessionStorage.setItem('token',"xyz-bogusToken");
      props.updateUser({name:"bogus", id: "5ffa8bf5c22bf4999335b3f6", userRole:{role:"admin"}});
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
  