const express = require('express');
const UserApi = express.Router();
const bcrypt= require('bcrypt');
const saltRound=10;
const mysqlConnection= require('../../config/mysqlconnection');
const {createToken}= require("../Auth/auth");


UserApi.post("/login",(request,response)=>{
    let password= request.body.password;
    mysqlConnection.query(`Select * from Users where username= '${request.body.email_username}' OR email= '${request.body.email_username}'`,(err,data) =>{
        if(data.length>0){
            bcrypt.compare(password,data[0].password,(err,result)=>{
                if(result){
                    const accessToken= createToken(data); 
                    response.status(200).json({response:{status:"success",data:{id:data[0].id,username:data[0].username,accessToken:accessToken}}});
                }
                else{
                    response.send({response:{status:"error",message:"You have entered wrong password"}});
                }
            });
        } else {
            response.send({response:{status:"error",message:"Invalid Credential"}});
        }
    });
})

UserApi.post("/register", (request,response) => {
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
                } else {
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


module.exports= UserApi;