const express = require('express');
const bodyParser = require('body-parser');
const Router = require('./src/apiroute/router.js');
const cors = require('cors');
var app = express();


// app.use(function(req, res, next) {
//   //res.header("Access-Control-Allow-Origin", "*");
//   //res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//   //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use("/", Router);

app.listen(3002,()=> console.log('server is running at 3002'));
