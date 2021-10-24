const express = require("express")
const router = express.Router();

//For handling the incoming login request
router.post("/",(req,res)=>{
    console.log("Reached /login post");
    res.send("submitted");
})

module.exports = router;