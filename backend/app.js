const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://hemanth:'+process.env.MONGO_ATLAS_PWD+'@meantest-a0zfg.mongodb.net/node-angular?retryWrites=true&w=majority').then
(()=>
{
  console.log("connected to database");
}).catch( () =>
{
  console.log("connection failed");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join(__dirname,'images')));
app.use("/",express.static(path.join(__dirname,'angular')));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept ,authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS,PUT"
  );
  next();
});
app.use('/api/posts',postRoutes);
app.use('/api/user',userRoutes);
app.use((req,res,next) =>
{
  res.sendFile(path.join(__dirname,"angular","index.html"));
})

module.exports = app;
