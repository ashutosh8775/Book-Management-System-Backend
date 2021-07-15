const express = require('express');
const Router = express.Router();
var cors = require('cors');
const mysqlConnection = require('../dbconnect/mysqlconnection.js');
const bcrypt= require('bcrypt');
const saltRound=10;



Router.get("/", (request, response) => {
    response.send("Welcome to Book Management project");
})

Router.get("/login/:useremail/:pass",(request,response)=>{
    mysqlConnection .query(`Select * from Users where `,(err,data) =>{
        if(err){
            response.send(err);
        } else{
            response.send(data);
        }
    });
})

Router.post("/register", (request,response) => {

 let pass=request.body.password;
 
 bcrypt.genSalt(saltRound, function(err,salt){
     bcrypt.hash(pass,salt,function(err,hash){
          request.body.password=hash;

          
          mysqlConnection.query('Insert into Users set ?', request.body,(err,data) =>{
           if(err){
               response.send(err);
           }else{
               response.send("Data inserted successfully!!!");
               
           }
       });
       
          
     });
    
   
   


 
   
 });

 



})

module.exports = Router;