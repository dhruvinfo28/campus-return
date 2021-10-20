const express = require('express')
const router = express.Router();

router.get('/',(req,res)=>{
    console.log("Reached /register get");
    res.render('register');
})

router.post('/',(req,res)=>{
    console.log("Reached /register post");    
    console.log(req.body);
    res.redirect('/login');
})
module.exports = router;