const express = require('express');
const Router = express.Router();
var cors = require('cors');
const mysqlConnection = require('../dbconnect/mysqlconnection.js');
const jwt = require('jsonwebtoken');
const {createToken,validateToken}= require("./auth");
const bcrypt= require('bcrypt');
const saltRound=10;
const session = require("express-session");





Router.get("/", validateToken, (request, response) => {
    response.send("Welcome to Book Management project");
})

Router.post("/login/:useremail/:password",(request,response)=>{
    let password= request.params.password;
    mysqlConnection.query(`Select * from Users where username= '${request.params.useremail}' OR email= '${request.params.useremail}'`,(err,data) =>{
        if(err){
            response.send("User not found");
        }        
            if(data.length>0){
                bcrypt.compare(password,data[0].password,(err,result)=>{
                    if(err){
                        response.json({error:"Wrong password"});
                    }
                   
                    if(result){
                        
                        
                        const accessToken= createToken(data);
                        response.cookie("access-token",accessToken,{
                                 maxAge: 60*60*24*30*1000,
                             });
                             response.send("Logged In");

                    }
                    else{
                        response.status(400).json({error:"You have entered wrong credential"});
                    }
                })
            }
            else{
                response.status(400).json({error:"User doesn't exist"});
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