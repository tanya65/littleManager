import React from 'react';
import './App.css';
import './components/signIn';
import {connect} from 'react-redux';
import Navbar from './components/navbar'

import AppRouter from './AppRouter';
import { BrowserRouter as Router } from 'react-router-dom';

class App extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
  return (
    <div className="App">   
     
      <Router>
      {this.props.user?.userRole?.role && <Navbar/>}
        <div style={{padding:"10vh 0"}}>
          <AppRouter/>
        </div>
      </Router> 
    </div>
    );
  }

}

const mapStateToProps = data => {
  return { user: data.user};
}  

export default connect(mapStateToProps, null)(App);

xxx