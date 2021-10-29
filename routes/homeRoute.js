const express = require('express')

const router = express.Router();

router.get('/',(req,res)=>{
    res.render('login',{error:req.flash('error')});
})

router.use('/logout',(req,res)=>{
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