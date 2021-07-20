const express = require('express');
const bodyParser = require('body-parser');
const UserApi= require('./src/Routes/Api/userApi');
const cors = require('cors');
const app = express();
const dotenv=require("dotenv");
const bookApi = require('./src/Routes/Api/bookApi');
const reviewApi = require('./src/Routes/Api/reviewApi');
dotenv.config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use("/", UserApi);
app.use("/",bookApi);
app.use("/",reviewApi);
app.listen(process.env.PORT,()=> console.log(`Server is running at ${process.env.PORT}`));
