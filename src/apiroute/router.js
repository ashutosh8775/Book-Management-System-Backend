const express = require('express');
const Router = express.Router();
var cors = require('cors');
const mysqlConnection = require('../dbconnect/mysqlconnection.js');
const jwt = require('jsonwebtoken');
const {createToken,validateToken}= require("./auth");
const bcrypt= require('bcrypt');
const saltRound=10;
const session = require("express-session");







Router.post("/login/:useremail/:password",(request,response)=>{
    let password= request.params.password;
    mysqlConnection.query(`Select * from Users where username= '${request.params.useremail}' OR email= '${request.params.useremail}'`,(err,data) =>{
             
            if(data.length>0){
                bcrypt.compare(password,data[0].password,(err,result)=>{
                  
                   
                    if(result){
                       const accessToken= createToken(data);
                         
                             response.status(200).json({response:{status:"success",data:{id:data[0].id,username:data[0].username,accessToken:accessToken}}});

                    }
                    else{
                        response.send({response:{status:"error",message:"You have entered wrong password"}});
                    }
                })
            }
            else{
                response.send({response:{status:"error",message:"Invalid Credential"}});
            }
            
           
        
    

    });
    
    
})

Router.post("/register", (request,response) => {
    let pass= request.body.password;
    bcrypt.genSalt(saltRound, function(err,salt){
        bcrypt.hash(pass,salt,function(err,hash){
            request.body.password = hash;
            mysqlConnection.query('Insert into Users set ?', request.body, (err, data) =>{
                if(err) {
                    let errData = [{
                        status: "error",
                        message: err.code === 'ER_DUP_ENTRY' ? "Username/Email id already exist" : "Something went wrong!",
                        data: err
                    }];
                    response.send(errData);
                } else{
                    let sucessData = [{
                        status: "success",
                        message: "You have been registered successfully",
                        data: data
                    }];
                    response.send(sucessData);
                }
            });   
        });
  
    });
});

Router.get("/getReview/:id", (request, response) => {
    let query = `Select r.*, u.username from Review r left join users u on r.user_id = u.id where book_id = '${request.params.id}' order by date desc`;
    mysqlConnection.query(query, (err, data) => {
        if(err) {
            response.send(err);
        } else {
            response.send(data);
        }
    });  
});

Router.post("/addReview", (request, response) => {
    mysqlConnection.query('Insert into Review set ?', request.body, (err, data) => {
        if(err){
            let errData = [{
                status: "error",
                message: "Something went wrong!",
                data: err
            }];
            response.send(errData);
        } else{
            let sucessData = [{
                status: "success",
                message: "Your review has been added",
                data: [{
                    "id": data.insertId,
                    "user_id": request.body.user_id,
                    "book_id": request.body.book_id,
                    "review": request.body.review,
                    "title": request.body.title,
                    "rating": request.body.rating
                }]
            }];
            response.send(sucessData);
        }
    });  
});

Router.get("/books",(request,response)=>{
    mysqlConnection.query(`Select * from Books `,(err,data) =>{
        if(err){
            response.send(err);
        } else{
            let resp = {
                "issuccess":0,
                "output":data
            }
            response.send(resp);
        }
    });
})
Router.get("/books/:id",(request,response)=>{
    mysqlConnection.query(`Select * from books where id = '${request.params.id}'`,(err,data) =>{
        if(err){
            response.send(err);
        } else{
            let resp = {
                "issuccess":0,
                "output":data
            }
            response.send(resp);
        }
    });
})


module.exports = Router;