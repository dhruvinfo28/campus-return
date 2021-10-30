const express = require('express')
const Student = require('../models/Student');

const router = express.Router();

router.get('/',(req,res)=>{
    console.log("Reached / get");
    res.render('login',{error:req.flash('error')});
})

router.get("/confirmEmail/:studentToken",async (req,res)=>{
    console.log("Reached confirmEmail/:studentToken get")
    const token = req.params.studentToken;
    try{
        let response = await Student.setVerifiedByToken(token); 
        console.log(response);
        res.redirect('/');
    }catch(err){
        console.log("Error while seting verified status: ", err);
    }
})

router.use('/logout',(req,res)=>{
    console.log("Reached /logout get&post");
    req.session.destroy(function(err){
        if(err)
            console.log(err);
        else{
            console.log("Successfully logged out!");
            res.redirect('/');
        }
    })
})
module.exports = router;