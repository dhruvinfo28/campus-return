require('dotenv').config()
const mysql = require('mysql2')

const db_config = {
    host: process.env.AZURE_SERVER_DB_HOST,
    user: process.env.AZURE_SERVER_DB_USER,
    database: process.env.AZURE_SERVER_DB,
    password:process.env.AZURE_SERVER_DB_PASSWORD
}

let db = mysql.createConnection(db_config)


let createStudent = "create table if not exists student" +
                    "(student_roll_number varchar(20) primary key,"+
                    "student_name varchar(50),"+
                    "student_branch varchar(60),"+
                    "student_email_id varchar(60),"+
                    "student_password varchar(30),"+
                    "student_yearofgrad int,"+
                    "student_programme varchar(20));"

db.query(createStudent,(err,db_response)=>{
    if(err){
        console.log('Error while creating student table: ')
        console.log(err)
    }else{
        console.log('student table created:');
        console.log(db_response)
    }
})        

setInterval(function () {
    db.query("Select 1");
}, 5000);

module.exports = db;