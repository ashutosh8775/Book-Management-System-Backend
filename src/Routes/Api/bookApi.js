const express = require('express');
const bookApi = express.Router();
const mysqlConnection= require('../../config/mysqlconnection');


bookApi.get("/books",(request,response)=>{
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
bookApi.get("/books/:id",(request,response)=>{
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

module.exports= bookApi;