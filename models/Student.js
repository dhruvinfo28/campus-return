const db = require('../middlewares/dbConnection');

class Student{
  constructor(rollNumber,name,branch,emailId,password,yearOfGrad,programme){
    this.rollNumber = rollNumber||null;
    this.name = name||null;
    this.branch = branch||null;
    this.emailId = emailId||null;
    this.password = password||null;
    this.yearOfGrad = yearOfGrad||null;
    this.programme = programme||null;
  }   
  save(){
      const insertQuery = "insert into student values(" +
                           "?,?,?,?,?,?,?);";
      db.query(insertQuery,[this.rollNumber,this.name,this.branch,this.emailId,this.password,this.yearOfGrad,this.programme],(err,db_response)=>{
          if(err){
              console.log("Error while saving student: ");
              console.log(err);
          }else{
              console.log("student saved successfully: ");
              console.log(db_response);
          }
      })
  }
}

module.exports = Student;