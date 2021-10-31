const express = require('express');
const fs = require('fs')

const Student = require('../models/Student');
const checkLoginStatus = require('../utilityFunctions/checkLoginStatus')
const upload = require('../middlewares/multerConfig');
const FirstDose = require('../models/FirstDose');
const SecondDose = require('../models/SecondDose');

const router = express.Router();

router.use(checkLoginStatus);

/**
 * Handles a get request for student dashboard
 */
router.get('/',(req,res)=>{
    console.log("Reached /dashboard get");
    res.render('testDashboard',{student:req.session.student,error:req.flash('error')});    
})

/**
 * Handles upload of FirstDose Certificate:
 */
router.post('/uploadFirstDose',upload.single('fDoseCertificate'),async (req,res)=>{
    console.log("Reached /dashboard/uploadFirstDose post");
    let data;
    try{
         data = await fs.readFileSync(`${__dirname}/../resources/${req.file.filename}`);
    }catch(fsError){
        console.log("Error in uploading file to server",fsError);
        req.flash('error','Error in uploading document! Try again later');
        res.redirect('/dashboard');
        return;
    }
    let fd = new FirstDose(req.file.filename,data,req.body.firstDoseID);
    try{
        let dbResponse = await fd.save(req.session.student.rollNumber);
        console.log(dbResponse);
        req.flash('error','Upload complete');
        res.redirect('/dashboard');
    }catch(uploadError){
        console.log("Error in saving to First_Dose: ",uploadError);
        req.flash('error','Error in uploading document! Try again later');
        res.redirect('/dashboard');
    }
    fs.unlink(`${__dirname}/../resources/${req.file.filename}`,(err)=>{
        if(err) console.log("First Dose delete fail: ",err);
        else console.log(req.file.filename," deleted");
    });
})

/**
 * Handles get request to view last firstDose Certificate
 */
router.get('/viewFirstDose',async (req,res)=>{
    console.log("Reached dashboard/viewFirstDose get");
    let data;
    try{
        data = await FirstDose.getFirstDoseCertificates(req.session.student.rollNumber);
    }catch(err){
        console.log("Error in fetching first dose certificates: ",err);
        req.flash('Please try again later');
        res.redirect('/dashboard');
        return;
    }
    let [rows,fields] = data;
    if(rows.length==0){
        req.flash('error','No first dose certificate found');
        res.redirect('/dashboard');
    }
    else{
        let certificate = rows[rows.length-1].FD_Document;
        res.write(certificate);
        res.end();
    }
})

/**
 * To handle post request for second dose certificate upload
 */
router.post('/uploadSecondDose',upload.single('sDoseCertificate'),async (req,res)=>{
    console.log("Reached /dashboard/uploadSecondDose post");
    let data;
    try{
        data = await fs.readFileSync(`${__dirname}/../resources/${req.file.filename}`);
    }catch(fsError){
        console.log("Error while reading second dose certificate from server!",fsError);
        req.flash('error',"Please try again later");
        res.redirect('/dashboard');
        return;
    }
    
    let fd = new SecondDose(req.file.filename,data,req.body.secondDoseID);
    try{
        let dbResponse = fd.save(req.session.student.rollNumber);   
        console.log(dbResponse);
        req.flash('error','Upload complete');
    }catch(err){
        console.log("Error while saving second dose certificate!",err);
        req.flash('error','Please try again later');
    }
    res.redirect('/dashboard');
    fs.unlink(`${__dirname}/../resources/${req.file.filename}`,(err)=>{
        if(err) console.log("First Dose delete fail: ",err);
        else console.log(req.file.filename," deleted");
    });
    
})


/**
 * Handles get request to view last firstDose Certificate
 */
router.get('/viewSecondDose',async (req,res)=>{
    let data;
    try{
        data = await SecondDose.getSecondDoseCertificates(req.session.student.rollNumber);
    }catch(err){
        console.log("Error fetching second dose certificates! ",err);
        req.flash('error','Try again later');
        res.redirect('/dashboard');
        return;
    }
    let [rows,fields] = data;
    if(rows.length==0){
        req.flash('error','No second dose certificate found');
        res.redirect('/dashboard');
        
    }else{
        let certi = rows[rows.length-1].FD_Document;
        res.write(certi);
        res.end();
    }
})

module.exports = router;