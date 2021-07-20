const express = require('express');
const reviewApi = express.Router();
const mysqlConnection= require('../../config/mysqlconnection');
const {validateToken}= require("../Auth/auth");


reviewApi.get("/review",(req,res) => {
    res.send("calling Review api");
})


reviewApi.get("/getReview/:id", (request, response) => {
    let query = `Select r.*, u.username from Review r left join users u on r.user_id = u.id where book_id = '${request.params.id}' order by date desc`;
    mysqlConnection.query(query, (err, data) => {
        if(err) {
            response.send(err);
        } else {
            response.send(data);
        }
    });  
});

reviewApi.post("/addReview", validateToken,(request, response) => {
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


module.exports = reviewApi;