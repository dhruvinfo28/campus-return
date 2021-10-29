const express = require("express");
const session = require('express-session')

const app = require("./server");
const db = require('./middlewares/dbConnection');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

app.use('/',require('./routes/homeRoute'));
app.use('/login',require('./routes/loginRoutes'));
app.use('/register',require('./routes/registerRoutes'));
app.use('/dashboard',require('./routes/dashboardRoutes'));
app.use('/test',require('./routes/testingRoutes'));