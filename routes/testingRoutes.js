const express = require('express')
const db = require('../middlewares/dbConnection')
const router = express.Router();

router.get('/queryAnyTable/:tableName',(req,res)=>{

    console.log("Reached /test/queryAnyTable/:tableName get");
    const tableName = req.params.tableName;
    if(tableName!=null){
        db.query("select * from " + tableName ,(err,result)=>{
            if(err){ 
                console.log(err);
                res.json({'message':'Please provide a valid table name for the selected databse'})
            }else{
                res.json(result);
            }
        })
    }else{
        res.json({'message':'Please provide a table name'});
    }
})


module.exports = router;