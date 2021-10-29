const express = require('express')

const router = express.Router();


router.get('/',(req,res)=>{
    if(req.session.student)
        res.render('testDashboard');
    else{
        console.log("Without login accessing dashboard!");
        res.redirect('/');
    }

})

module.exports = router;