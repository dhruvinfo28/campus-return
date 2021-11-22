const express = require("express");


const app = express();


app.listen(process.env.PORT || 3000,(err)=>{console.log("App listening at 3000")});

module.exports = app;