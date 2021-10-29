const express = require('express')

const router = express.Router();


router.get('/',(req,res)=>{
    if(req.session.student){
        console.log(req.session.student)
        res.render('testDashboard',{student:req.session.student});
    }
    else{
        console.log("Without login accessing dashboard!");
        res.redirect('/');
    }

})

module.exports = router;