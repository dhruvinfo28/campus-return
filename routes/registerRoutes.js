const Student = require('../models/Student');

const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Reached /register post');
    const data = req.body;
    if (!data.email.match("@nith.ac.in$")) {
        //A flash message saying, use institute id
        console.log("Not institute ID");
        res.redirect('/');
    } else {
        try {
            const [rows, fields] = await Student.findByRollNumber({ rollNumber: data.roll_number });
            if (rows.length == 0) {
                let hashedPassword = null;
                try{
                    hashedPassword = await bcrypt.hash(data.password,10);
                }catch(bcryptErr){
                    console.log("bcryptErr, ", bcryptErr);
                    res.redirect('/');
                    return;
                }

                let student = new Student(data.roll_number, data.name, data.branch, data.email, hashedPassword, data.year, data.programme);

                try {
                    //A flash saying , registered now log in
                    const result = await student.save();
                    console.log("Student saved, ", result);
                    res.redirect('/');
                } catch (saveError) {
                    //A flash saying please try again later
                    console.log("Error in saving a student, ", saveError);
                    res.redirect('/');
                }

            } else {
                //A flash message saying already registered
                console.log('Student already registered');
                res.redirect('/');
            }
        } catch (err) {
            //A flash message saying try again later
            console.log("Error in fetching student by roll number");
            res.redirect('/');
        }
    }
})

module.exports = router;