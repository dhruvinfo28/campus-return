const Student = require('../models/Student');

const express = require('express')

const router = express.Router();

router.post('/',(req,res)=>{
    console.log('Reacher /register post');
    console.log(req.body);
    res.send('Submitted');
})

module.exports = router;