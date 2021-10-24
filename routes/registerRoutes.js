const Student = require('../models/Student');

const express = require('express')

const router = express.Router();

router.post('/', (req, res) => {
    console.log('Reached /register post');

    //TODO: Hash passwords while saving
    const data = req.body;
    if (!req.body.email.match("@nith.ac.in$")) {
        console.log("Not an institue id");
        res.redirect('/');
    }
    else {
        Student.findByRollNumber({ rollNumber: data.roll_number })
            .then(([rows, fields]) => {
                if (rows.length == 0) {
                    console.log("Registering student... ");
                    let student = new Student(data.roll_number, data.name, data.branch, data.email, data.password, data.year, data.programme);
                    student.save()
                        .then(result => {
                            //A flash message asking to login after email verification
                            console.log('student saved: ', result);
                            res.redirect('/');
                        })
                        .catch(err => {
                            //A flash message saying register again!
                            console.log("Error in saving a student, ", err);
                            res.redirect('/');
                        })
                } else {
                    //A flash message saying already registered
                    console.log('Student already registered');
                    res.redirect('/');
                }
            })
            .catch(err => {
                console.log("error in finding student by roll_number: ");
                console.log(err);
            })
    }


})

module.exports = router;