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
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import UserIcon from '../resources/profile-user.png';

import UserAPI from '../api-client/user';
import UserRoleAPI from '../api-client/userRole';
import TeamAPI from '../api-client/team';
import DesignationAPI from '../api-client/designation';

import '../styles/employee-details.scss';

class UserDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = { role: "employee" };
        this.mySubmitHandler = this.mySubmitHandler.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.addNew = this.addNew.bind(this);
        this.loadUserDetails = this.loadUserDetails.bind(this);
    }

    extractUserId(currentPath) {
        let userId = currentPath.split('/')[2];
        return userId;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.pathname && prevState.pathname != this.state.pathname) {
            this.setState({ pathname: null })
        }
    }

    componentDidMount() {

        let currentPath = window.location.pathname;
        if (currentPath == "/profile") {
            this.setState({ profileView: true });
            this.loadUserDetails(this.props.user?.id);

        }
        else if (currentPath != "/user/add") {
            let userId = this.extractUserId(currentPath);
            this.loadUserDetails(userId);
        }
        if (this.props.user?.userRole?.role == "admin") {
            this.loadRoles();
            this.loadTeams();
            this.loadDesignations();
        }
    }

    loadUserDetails(userId) {
        UserAPI.getUserDetails(userId)
            .then(arrayOfUserDetails => {
                let userDetails = arrayOfUserDetails[0];
                this.setState({ userId: userDetails._id, firstName: userDetails.firstName, lastName: userDetails.lastName, salary: userDetails.salary, role: userDetails.userRole?.name, designation: userDetails.designation?._id, team: userDetails.team?._id });
            })
    }

    async loadRoles() {
        UserRoleAPI.getUserRoles()
            .then(resp => {
                let stateObj = {};
                stateObj.userRoles = resp;
                if (!this.state.profileView) stateObj.role = resp[1]?.name;
                this.setState(stateObj);
            });
    }

    async loadTeams() {
        TeamAPI.getTeams()
            .then(resp => {
                let stateObj = {};
                stateObj.teams = resp;
                if (!this.state.profileView) stateObj.team = resp[0]?._id;
                this.setState(stateObj);
            });
    }

    async loadDesignations() {
        DesignationAPI.getDesignations()
            .then(resp => {
                this.setState({ designations: resp })
            });
    }

    render() {

        if (this.state.pathname) {
            return <Redirect push to={{ pathname: this.state.pathname }} />
        }

        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={this.state.openMessage ? true : false}
                    autoHideDuration={2000}
                    TransitionComponent={Slide}
                    onClose={() => this.closePopup()}>
                    <MuiAlert elevation={4} variant="filled" onClose={() => this.closePopup()} severity={this.state.messageVariant}>
                        {this.state.message}
                    </MuiAlert>
                </Snackbar>

                <Backdrop style={{ zIndex: "100" }} open={this.state.loading?true:false}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <div style={{  marginBottom:"4vh", padding:"5px 25px", textAlign:"left", borderBottom:"1.5px solid #A0A0A0"}}>
                    <span style={{textAlign:"left", fontSize:"30px"}}>{this.state.profileView? "My Profile":" User Details"}</span>
                </div>

                <div className="parent">
                    <div>
                        <img src={UserIcon} style={{width:"58px"}}></img>
                    </div>
                    <MaterialUIForm onSubmit={this.mySubmitHandler}>
                        <div className="form-body">
                            <TextField required className="field" label="Firstname" value={this.state.firstName || ""} onChange={e => this.setState({ firstName: e.target.value })} />
                            <TextField required className="field" label="Lastname" value={this.state.lastName || ""} onChange={e => this.setState({ lastName: e.target.value })} />
                            <TextField required className="field" label="Username" value={this.state.userName || ""} onChange={e => this.setState({ userName: e.target.value })} />

                            <NumberFormat required prefix={'$'} placeholder="eg 1,000" label="Salary" value={parseFloat(this.state.salary) || ""} onValueChange={e => this.setState({ salary: e.value })} allowNegative={false}
                               thousandSeparator={true} customInput={TextField} className="field" key={0} disabled={this.state.profileView || this.props.user?.userRole?.role != "admin" ? true : false} />
                            <FormControl className="field">
                                <FormControlLabel className="checkboxRole"
                                    value="start"
                                    control={
                                        <Checkbox disabled={this.state.profileView ? true : false}
                                            color="primary" checked={this.state.role == "admin" ? true : false} onClick={e => this.setState({ role: e.target.checked ? "admin" : 'employee' })} />
                                    }
                                    label="Admin"
                                    labelPlacement="start"
                                />
                            </FormControl>

                            <FormControl className="field">
                                <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                                <Select
                                    disabled={this.state.profileView && this.props.user?.userRole?.role != "admin" ? true : false}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.designation || ''}
                                    onChange={e => this.setState({ designation: e.target.value })}>
                                    <MenuItem key="add-new" value="" onClick={e => this.addNewItem("designation")}><Button>Add</Button></MenuItem>

{
                                        this.state.designations && this.state.designations.map(designation => {
                                            if (!designation) return;
                                            return <MenuItem value={designation._id} key={designation.name}>{designation.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>

                            {!(this.state.profileView && this.props.user?.userRole?.role == "admin") &&
                                <FormControl className="field">
                                    <InputLabel id="demo-simple-select-label">Team</InputLabel>
                                    <Select
                                        disabled={this.props.user?.userRole?.role != "admin" ? true : false}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={this.state.team || ''}
                                        onChange={e => this.setState({ team: e.target.value })}>
                                        <MenuItem key="add-new" value="" onClick={e => this.addNewItem("team")}><Button>Add</Button></MenuItem>

{
                                            this.state.teams && this.state.teams.map(team => {
                                                if (!team) return;
                                                return <MenuItem value={team._id} key={team.name}>{team.name}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            }

                        </div>
                        <Button variant="contained" type="submit" className="action-button save"> Save </Button>
                    </MaterialUIForm>
                </div>

                <Dialog open={this.state.addNewType ? true : false} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add New {this.state.addNewType}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={this.state.addNewType}
                            fullWidth
                            onChange={e => this.setState({ newItemName: e.target.value })}
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

    async addNew() {
        this.setState({ loading: true });
        this.closeDialog();

        let newItem = { name: this.state.newItemName };
        switch (this.state.addNewType) {
            case "team":
                await TeamAPI.add(newItem).then(newTeam => {
                    let teams = this.state.teams;
                    teams.push(newTeam);
                    this.setState({
                        teams, team: newTeam._id, loading: false,
                        openMessage: true, messageVariant: "success", message: newTeam.name + ` added to list of teams`
                    });
                })
                break;
            case "designation":
                await DesignationAPI.add(newItem).then(newDesignation => {
                    let designations = this.state.designations;
                    designations.push(newDesignation);
                    this.setState({
                        designations, designation: newDesignation._id, loading: false,
                        openMessage: true, messageVariant: "success", message: newDesignation.name + ` added to list of designations`
                    });
                });
                break;
        }

    }

    closeDialog() {
        this.setState({ addNewType: null });
    }

    addNewItem(type) {
        this.setState({ addNewType: type });
    }

    mySubmitHandler() {
        this.setState({ loading: true });
        let user = {};
        user._id = this.state.userId;
        user.firstName = this.state.firstName;
        user.lastName = this.state.lastName;
        user.userName = this.state.userName;
        user.salary = this.state.salary;
        user.userRole = this.getRoleId();
        user.designation = this.state.designation;
        user.team = this.state.team;

        UserAPI.addUser(user)
            .then(result => {
                let message = this.state.userId? "Updated ":"Added ";
                message = message + result.firstName;
                this.setState({ loading: false, openMessage: true, messageVariant: "success", message, pathname:"/dashboard/employees"})
            })
    }

    getRoleId() {
        let role = this.state.role;
        let userRoles = this.state.userRoles;
        for (let item of userRoles) {
            if (item.name == role) {
                return item._id;
            }
        }
        return null;
    }

    //snackbar
    closePopup = () => {
        this.setState({ message: "", openMessage: false });
    }

}
const mapStateToProps = data => {
    return { user: data.user };
}
export default connect(mapStateToProps)(UserDetails);
