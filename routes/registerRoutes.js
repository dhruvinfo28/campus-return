const Student = require('../models/Student');
const mailer = require('../utilityFunctions/sendConfirmationMail');

const express = require('express')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Reached /register post');

    const data = req.body;

    /**
     * Check if the given email is institute id
     */
    if (!data.email.match("@nith.ac.in$")) {
        console.log("Not institute ID");
        req.flash('error','Please use institute ID');
        res.redirect('/');
    }
    else {

        /**
         * Check if a student record exists with the same roll number
         */
        try {
            const [rows, fields] = await Student.findByRollNumber({ rollNumber: data.roll_number });
            if (rows.length == 0) {

                /**
                 * Hashed password generation 
                 */
                let hashedPassword = null;
                try {
                    hashedPassword = await bcrypt.hash(data.password, 10);
                } catch (bcryptErr) {
                    console.log("bcryptErr, ", bcryptErr);
                    req.flash('error','Please try again later');
                    res.redirect('/');
                    return;
                }

                /**
                 * Token generation try catch
                 */
                let token;
                try {
                    token = await crypto.randomBytes(16).toString("hex");
                    console.log(token);
                } catch (tokenErr) {
                    
                    req.flash('error','Please try again later');
                    console.log("Token generation error");
                    res.redirect('/');
                }
                
                /**
                 * Saving the student
                 */
                let student = new Student(data.roll_number, data.name, data.branch, data.email, data.year, data.programme, token,hashedPassword);
                try {
                    const result = await student.save();
                    console.log("Student saved, ", result);
                    req.flash('error','Registered, confirm your email and login!')
                    res.redirect('/');
                } catch (saveError) {
                    req.flash('error','Please try again later');
                    console.log("Error in saving a student, ", saveError);
                    res.redirect('/');
                }

                /**
                 * Sending a mail in the background:
                 */
                try{
                    let mailStatus = await mailer(data.roll_number,data.email);
                    console.log("Confirmation mail sent successfully!", mailStatus);
                }catch(err){
                    console.log("Error sending confirmation mail: ", err);
                }
                
            } else {
                req.flash('error','ALready registered, please login!');
                console.log('Student already registered');
                res.redirect('/');
            }
        } catch (err) {
            req.flash('error','Please try again later');
            console.log("Error in fetching student by roll number");
            res.redirect('/');
        }
    }
})

module.exports = router;