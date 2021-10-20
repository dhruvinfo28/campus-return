const express = require('express')
const db = require('../middlewares/dbConnection')
const upload = require('../middlewares/multerConfig')

const fs = require('fs')
const router = express.Router();

//Query any table by providing tableName in request query
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

//Returns the image upload form
router.get('/imageUpload',(req,res)=>{
    console.log("Reached /test/imageUpload get");
    res.render("image-upload-form");
})


//Handles the image form post request
router.post('/imageUpload',upload.single('avatar'),(req,res)=>{
    console.log('Reached /test/imageUpload post')
    
    const name = __dirname+`/../resources/${req.file.filename}`;
    
    //This is the buffer instance
    const data = fs.readFileSync(__dirname+`/../resources/${req.file.filename}`);

    const sql = "insert into img(file_name,file_buffer) values(?,?)"
    db.query(sql,[req.file.filename,data],(err,db_response)=>{
        if(err){
            console.log('here inside db-error')
            res.send(err);
        }else{
            console.log(db_response);
            res.send('uploaded');
        }
        console.log("This is the db response");
        console.log(db_response)
    })

    //Writing the buffer instance back to the client
    // res.write(data,'binary');
    // res.end(null,'binary')111

    // res.send('Uploaded');
})


//Renders the required image from the img table in development database
router.get('/getImage/:id',(req,res)=>{
    console.log('Reached /test/getImage/:id get');
    const sql  = "select file_buffer from img where img_id = ?";
    db.query(sql,[req.params.id],(err,db_response)=>{
        if(err){
            res.send("Sorry some error");
        }else{
            res.write(db_response[0].file_buffer);
        }
    })
})

module.exports = router;