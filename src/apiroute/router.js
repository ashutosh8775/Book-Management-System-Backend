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
});

Router.get("/getReview/:id", (request, response) => {
    let query = `Select r.*, u.firstname, u.lastname from Review r left join users u on r.user_id = u.id where book_id = '${request.params.id}' order by date desc`;
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



module.exports = Router;