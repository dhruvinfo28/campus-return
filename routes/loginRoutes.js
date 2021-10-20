const express = require("express")
const router = express.Router();

//For rendering the login page
router.get("/",(req,res)=>{
    console.log("Reached /login get");
    res.render('login');
})

//For handling the incoming login request
router.post("/",(req,res)=>{
    console.log("Reached /login post");
    res.send("submitted");
})

module.exports = router;