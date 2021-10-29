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
                    "student_password varchar(150),"+
                    "student_yearofgrad int,"+
                    "student_programme varchar(20)," + 
                    "student_token varchar(150)," +
                    "student_verified_status tinyint(1))";

db.promise().query(createStudent)
    .then(result=>{
        console.log('student table created,' , result);
    })
    .catch(err=>{
        console.log('Error in creating student table ', err);
    })
       

setInterval(function () {
    db.query("Select 1");
}, 5000);

module.exports = db;