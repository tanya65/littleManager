import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import MaterialUIForm from 'material-ui-form';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect} from 'react-redux';
import NumberFormat from 'react-number-format';

import UserAPI from '../api-client/user';
import UserRoleAPI from '../api-client/userRole';
import TeamAPI from '../api-client/team';
import DesignationAPI from '../api-client/designation';

import '../styles/employee-details.scss';

class UserDetails extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.mySubmitHandler = this.mySubmitHandler.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.addNew = this.addNew.bind(this);
        this.loadUserDetails = this.loadUserDetails.bind(this);

    }    

    extractUserId(currentPath){
        let userId = currentPath.split('/')[2];
        return userId;
    }

    componentDidMount(){

        let currentPath = window.location.pathname;
        if(currentPath=="/profile"){
            this.state = {profileView:true}
        }
        else if(currentPath!="/user/add") {
            let userId = this.extractUserId(currentPath);
            this.loadUserDetails(userId);
        }
        else if(this.state.profileView){
            this.loadUserDetails(this.props.user?.id);
        }
    
        if(this.props.user?.userRole?.role=="admin"){
            this.loadRoles();
            this.loadTeams();
            this.loadDesignations();    
        }
            
    }

    loadUserDetails(userId){
        UserAPI.getUserDetails(userId)
        .then(arrayOfUserDetails=>{
            let userDetails = arrayOfUserDetails[0];
            this.setState({userId:userDetails._id, firstName:userDetails.firstName, lastName:userDetails.lastName, salary:userDetails.salary, role:userDetails.userRole?._id, designation:userDetails.designation?._id, team:userDetails.team?._id});
        })
    }

     async loadRoles(){
        UserRoleAPI.getUserRoles()
        .then(resp=>{
            this.setState({userRoles:resp, role:resp[0]?._id})
        });
     } 

     async loadTeams(){
        TeamAPI.getTeams()
        .then(resp=>{
            this.setState({teams:resp, team:resp[0]?._id})
        });
     } 

     async loadDesignations(){
        DesignationAPI.getDesignations()
        .then(resp=>{
            this.setState({designations:resp})
        });
     } 

    render() {
        return (
            <div>
                <div style={{width:"90%",backgroundColor:"yellow",display:"inline-block"}}>
                <MaterialUIForm onSubmit={this.mySubmitHandler}>
                    <div className="form-body"> 
                    <TextField required className="field" label="firstname" helperText="It helps to have firstname" value={this.state.firstName || ""} onChange={e=>this.setState({firstName:e.target.value})}/>
                    <TextField required className="field" label="lastname" helperText="It helps to have lastname" value={this.state.lastName || ""} onChange={e=>this.setState({lastName:e.target.value})}/>
                    { !(this.state.profileView && this.props.user?.userRole?.role=="admin") && <NumberFormat required placeholder="eg 1,000" label="salary" value={parseFloat(this.state.salary) || ""} onValueChange={e=>this.setState({salary:e.value})} allowNegative={false}
                        thousandSeparator={true} customInput={TextField} className="field" key={0} disabled={this.props.user?.userRole?.role!="admin" ? true:false }/> }
                    
                    <FormControl className="field">
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select 
                    disabled={this.state.profileView && this.props.user?.userRole?.role=="admin" ? true:false}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.role || ''}
                    onChange={e=>this.setState({role:e.target.value})}>
                        {
                            this.state.userRoles && this.state.userRoles.map(role=> 
                                 <MenuItem value={role._id} key={role.name}>{role.name}</MenuItem>
                                )
                        }
                         
                    </Select>
                    </FormControl>

                    <FormControl className="field">
                    <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                    <Select 
                    disabled={this.state.profileView && this.props.user?.userRole?.role!="admin" ? true:false}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.designation || ''}
                    onChange={e=>this.setState({designation:e.target.value})}>
                        <MenuItem key="add-new" value="" onClick={e=>this.addNewItem("designation")}><Button>Add</Button></MenuItem>)

                        {
                            this.state.designations && this.state.designations.map(designation=>
                                <MenuItem value={designation._id} key={designation.name}>{designation.name}</MenuItem>)
                        }
                    </Select>
                    </FormControl>

                    { !(this.state.profileView && this.props.user?.userRole?.role=="admin") && 
                        <FormControl className="field">
                        <InputLabel id="demo-simple-select-label">Team</InputLabel>
                        <Select
                        disabled={this.props.user?.userRole?.role!="admin" ? true:false}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.team || ''}
                        onChange={e=>this.setState({team:e.target.value})}>
                            <MenuItem key="add-new" value="" onClick={e=>this.addNewItem("team")}><Button>Add</Button></MenuItem>)

                            {
                                this.state.teams && this.state.teams.map(
                                    team=> <MenuItem value={team._id} key={team.name}>{team.name}</MenuItem> )
                            }
                        
                        </Select>
                        </FormControl>
                    }

                    </div>
                    <Button variant="contained" type="submit"> Save </Button>
                </MaterialUIForm>
                </div>

                <Dialog open={this.state.addNewType?true:false} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add New {this.state.addNewType}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={this.state.addNewType}
                            fullWidth
                            onChange={e=>this.setState({newItemName:e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.addNew} color="primary">
                        Add
                    </Button>
                    <Button onClick={this.closeDialog} color="primary">
                        Cancel
                    </Button>
                    </DialogActions>
                </Dialog>


            </div>
        )
    }

    async addNew(){

        let newItem = {name:this.state.newItemName};
        switch(this.state.addNewType){
            case "team": 
                await TeamAPI.add(newItem).then(newTeam=>{
                    let teams = this.state.teams;
                    teams.push(newTeam);
                    this.setState({teams,team:newTeam});
                })
                break;
            case "designation":
                await DesignationAPI.add(newItem).then(newDesignation=>{
                    let designations = this.state.designations;
                    designations.push(newDesignation);
                    this.setState({designations, designation:newDesignation});
                })
                break;
        }

        this.closeDialog();
    }

    closeDialog(){
        this.setState({addNewType:null});
    }

    addNewItem(type){
        this.setState({addNewType:type});
    }

    mySubmitHandler(){
        let user = {};
        user._id = this.state.userId;
        user.firstName = this.state.firstName; 
        user.lastName = this.state.lastName;
        user.salary = this.state.salary;
        user.userRole = this.state.role;
        user.designation = this.state.designation;
        user.team = this.state.team;

        UserAPI.addUser(user)
        .then(result=>{
            console.log("result",result);
        })
    }

}
const mapStateToProps = data => {
    return { user: data.user};
  }  
  
export default connect(mapStateToProps)(UserDetails);
 