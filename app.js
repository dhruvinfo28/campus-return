const express = require("express");
const app = require("./server");

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.set('view engine','ejs');
app.use(express.static('public'));


app.use('/login',require('./routes/loginRoutes'));
app.use('/register',require('./routes/registerRouter'));