const express = require("express")
const bcrypt = require('bcrypt')

const Student = require('../models/Student')
const router = express.Router();

//For handling the incoming login request
router.post("/",async (req,res)=>{
    console.log("Reached /login post");
    /** TODO:
     * Find student
     * Check verified
     * Match password
     * Save session
     */

    try{
        const [rows,fields] = await Student.findByRollNumber({rollNumber: req.body.roll_number || '1'});
        if(rows.length == 0){
            req.flash('error','No account found!');
            console.log("Student not find while an attempted login, please register!");
            res.redirect('/');
        }
        else{
            const attemptingStudent = rows[0];
            if(attemptingStudent.student_verified_status !== 0){
                bcrypt.compare(req.body.password,attemptingStudent.student_password, (bcryptErr,result)=>{
                    if(!bcryptErr){
                        if(result){
                            //Save session, redirect to dashboard
                            console.log("Successfully logged in");
                            req.session.student = new Student(attemptingStudent.student_roll_number,attemptingStudent.student_name,attemptingStudent.student_branch,attemptingStudent.student_email_id,attemptingStudent.student_yearofgrad,attemptingStudent.student_programme);
                            res.redirect('/dashboard');
                        }
                        else{
                            req.flash('error','Incorrect roll number or password!');
                            console.log("Wrong password");
                            res.redirect('/');
                        }
                    }else{
                        console.log("Bcrypt compare error!");
                        console.log(bcryptErr);
                        req.flash('error','Try again later');
                        res.redirect('/');
                    }
                })
            }else{
                req.flash('error','Please confirm your email first');
                console.log("Student not verified");
                res.redirect('/');
            }
        }

    }catch(StudendFindErr){
        req.flash('error','Try again later.');
        console.log("There was some error in finding student by roll number");
        res.redirect('/');
    }
})

module.exports = router;