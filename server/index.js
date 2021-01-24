
require('dotenv').config();
const express = require('express');
var session = require('express-session')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const fetch = require('node-fetch');
mongoose.connect(MONGODB_URI, { useNewUrlParser: true ,useUnifiedTopology: true});

const userDAO = require('./DAO/userDAO').UserDAO;
const userRoleDAO = require('./DAO/userRoleDAO').UserRoleDAO;
const teamDAO = require('./DAO/teamDAO').TeamDAO;
const designationDAO = require('./DAO/designationDAO').DesignationDAO;
const leaveDAO = require('./DAO/leaveDAO').LeaveDAO;
const payrollDAO = require('./DAO/payrollDAO').PayrollDAO;

const db = mongoose.connection;
const PORT = process.env.PORT || 5000;

db.once('open', _ => {
  console.log('Database connected:', MONGODB_URI)
})

db.on('error', err => {
  console.error('connection error:', err)
})

var corsOptionsDelegate = function(req,callback){
    let corsOptions;
    let origin = req.headers.origin;
    let allowedOrigins = process.env.AUTHORIZED_ORIGINS.split(',');
  
    if (allowedOrigins.indexOf(origin) > -1) {
      allowedOrigins = origin;
    }
  
    corsOptions = {
      origin: allowedOrigins,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ['_host_Info', 'Origin', 'X-Requested-With', 'contentType', 'Content-Type', 'Accept', 'Authorization', 'form-data', 'token', 'refreshToken'],
      credentials: true,
      optionsSuccessStatus: 200
    }
  
    callback(null, corsOptions);
  }

app.use(cors(corsOptionsDelegate));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/auth",async (req, res)=>{

  try{

    let authorizationHeader = req.headers['Authorization'];
    if (!authorizationHeader) authorizationHeader = req.headers['authorization'];
    let token = authorizationHeader;
    console.log("token:",token);
    let user;

    let promise = await fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+token, {
          method: 'GET',
          credentials: 'include',
          redirect: 'follow',
          agent: null,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
          timeout: 5000
        })
        .then(resp=>resp.json())
        .then(async resp=>{
          user = await verify(resp);
        })
      .finally(resp=>{
        let status = user?200:403;
        return res.status(status).send(user);
      })
    
    }
  catch(err){
    return res.status(500).send(err);
  }
   
})

async function verify(obj){
  if(obj.email_verified){
    let username = obj.email;
    if(!username) return null;

    let user = await userDAO.findUserByUsername(username);
    return user;
  }
}

app.get("/user/:userId",async (req, res)=>{

  try{
    let userId = req.params.userId;
    let users = await userDAO.getUsers(userId);
    return res.send(users);
  }
  catch(err){
    return res.status(500).send(err);
  }
   
})

app.post("/user/add",async (req, res)=>{

  try{
    let userDetails = req.body;
    let user = await userDAO.addUser(userDetails);
    return res.send(user);
  }
  catch(err){
    return res.status(500).send(err);
  }
   
})

app.post("/team/add",async (req, res)=>{

  try{
    let newTeam = req.body;
    newTeam = await teamDAO.addTeam(newTeam);
    return res.send(newTeam);
  }
  catch(err){
    return res.status(500).send(err);
  }
   
})

app.post("/designation/add",async (req, res)=>{

  try{
    let newDesignation = req.body;
    newDesignation = await designationDAO.addDesignation(newDesignation);
    return res.send(newDesignation);
  }
  catch(err){
    return res.status(500).send(err);
  }
   
})

app.post("/leave/add",async (req, res)=>{

  try{
    let newLeave = req.body;
    newLeave.status="requested";
    newLeave = await leaveDAO.addLeaveApplication(newLeave);
    return res.sendStatus(200);
  }
  catch(err){
    return res.status(500).send(err);
  }
   
})

app.post("/leave/update",async (req, res)=>{

  try{
    let leave = req.body;
    await leaveDAO.updateLeave(leave);
    return res.sendStatus(200);
  }
  catch(err){
    console.log(err);
    return res.status(500).send(err);
  }
   
})

app.get('/leave',async (req,res)=>{
  let leaves = await leaveDAO.getLeaveApplications();
  return res.send(leaves);
})

app.get('/leave/user/:userId',async (req,res)=>{
  let userId = req.params.userId;
  let leaves = await leaveDAO.getLeaveApplications(userId);
  return res.send(leaves);
})


app.get('/userRole',async (req,res)=>{
  let userRoles = await userRoleDAO.getRoles();
  return res.send(userRoles);
})

app.get('/team',async (req,res)=>{
  let teams = await teamDAO.getTeams();
  return res.send(teams);
})

app.get('/designation',async (req,res)=>{
  let designations = await designationDAO.getDesignations();
  return res.send(designations);
})

app.post('/payroll',async (req,res)=>{
  let fromDate = req.body.fromDate;
  let toDate = req.body.toDate;
  let excludeUnsentPayrolls = req.query.excludeUnsentPayrolls;

  let payrolls = await payrollDAO.getPayrollsForPeriod(fromDate, toDate, excludeUnsentPayrolls);
  return res.send(payrolls);
})

app.post('/payroll/save',async (req,res)=>{
  let payroll = req.body.payroll;
  let savedPayroll = await payrollDAO.savePayroll(payroll);
  return res.send(savedPayroll);
})

// app.post('/payroll/unsent',async (req,res)=>{
//   let fromDate = req.body.fromDate;
//   let toDate = req.body.toDate;
//   let payrolls = await payrollDAO.getEmployeesWithUnsentPayrollsForPeriod(fromDate, toDate);
//   return res.send(payrolls);
// })


app.listen(PORT ,()=>{
    console.log("listening...");
})