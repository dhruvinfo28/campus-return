const transporter = require('../middlewares/nodeMailerTransporter');
const Student = require('../models/Student');
const url = require('./url');

module.exports = async function(studentRollNumber, studentEmail){

    let student;

    try{
        let [rows,fields]= await Student.findByRollNumber({rollNumber:studentRollNumber});
        student = rows[0];
        console.log(student.student_token);
    }catch(err){
        console.log('Error in find student by roll number,inside cofirmation mail utility');
        throw err;
    }

    try{
        let response = await transporter.sendMail({
            to:studentEmail,
            subject:'Confirmation mail from campus return',
            html:`<a href = ${url}/confirmEmail/${student.student_token}>Click here!</a>`
        })
        console.log(response);
        return response;
    }catch(err){
        console.log("Can't send confirmation email");
        console.log(err);
        throw err;
    }

}