const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

router.use((req,res,next)=>{
    console.log("Reached login status check for /dashboard");
    if(req.session.student){
        next();
    }else{
        req.flash('error','Please login first');
        console.log("Without login accessing dashboard!");
        res.redirect('/');
    }
})

router.get('/',(req,res)=>{
    console.log("Reached /dashboard get");
    res.render('testDashboard',{student:req.session.student});    
})

module.exports = router;