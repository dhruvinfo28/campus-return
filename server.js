const express = require("express");


const app = express();


app.listen(3000 || process.env.PORT,(err)=>{console.log("App listening at 3000")});

module.exports = app;