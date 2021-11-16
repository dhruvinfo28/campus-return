const authenticate = require('../utilityFunctions/checkAdminLoginStatus');

const express = require('express')

const router = express.Router();


router.get('/',(req,res,next)=>{
    console.log("Reached /admin get");
    res.render('admin-panel/login',{'error':req.flash('error')});
})

router.post('/',(req,res)=>{
    console.log("Reached /admin post");
    const data = req.body;

    if(data.admin_name === process.env.ADMIN_NAME && data.admin_password == process.env.ADMIN_PASSWORD){
        req.session.admin = 1;
        res.redirect('/admin/dashboard');
    }else{
        req.flash('error','Incorrect username or password');
        console.log("Wrong admin panel credentials");
        res.redirect('/admin');
    }
})

router.get('/dashboard',authenticate,(req,res)=>{
    console.log("Reached /admin/dashboard get");
    res.render('admin-panel/dashboard');
})


router.post('/logout',(req,res)=>{
    console.log("Reached /admin/logout post");
    if(req.session.admin === 1){
        req.session.admin = 0;
        res.redirect('/admin');
    }
})
module.exports = router;