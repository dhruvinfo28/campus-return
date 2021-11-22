const authenticate = require('../utilityFunctions/checkAdminLoginStatus');
const Application = require('../models/Application')
const Student = require('../models/Student')
const FirstDose = require('../models/FirstDose');
const SecondDose = require('../models/SecondDose')
const Rtpcr = require('../models/Rtpcr')

const express = require('express');

const router = express.Router();

/**
 * For handling login get
 */
router.get('/',(req,res,next)=>{
    console.log("Reached /admin get");
    res.render('admin-panel/login',{'error':req.flash('error')});
})

/**
 * For handling post request of incoming login request
 */
router.post('/',(req,res)=>{
    console.log("Reached /admin post");
    const data = req.body;

    if(data.admin_name === process.env.ADMIN_NAME && data.admin_password == process.env.ADMIN_PASSWORD){
        req.session.admin = 1;
        res.redirect('/admin/dashboard');
    }else{
        req.flash('error','Incorrect username or password');
        console.log("Wrong admin panel credentials");
        res.redirect('/admin');
    }
})

/**
 * For viewing all applications on the dashboard
 */
router.get('/dashboard',authenticate,async (req,res)=>{
    console.log("Reached /admin/dashboard get");
    let data = [];
    try{
        let [rows,fields] = await Application.findAll();
        data = rows;    
    }catch(err){
        console.log("error in finding all applications: ",err);
        res.redirect('/admin');
        return;
    }
    res.render('admin-panel/dashboard',{data:data,error:req.flash('error')});
})


/**
 * For particular application request by admin
 */
router.get('/application/:id',authenticate,async (req,res)=>{
    console.log("Reached /admin/application/:id get");
    let applicationId = req.params.id;
    if(applicationId === null || applicationId === undefined){
        req.flash('error','Please select a valid application')
        res.redirect('/admin/dashboard');
        return;
    }
    let docIds = [], data;

    try{
        docIds = await Application.findCertificateIdsByApplicationId(applicationId);
    } catch(err){
        req.flash('error','Try again later!');
        res.redirect('/admin/dashboard');
        console.log("Error in finding certi ids corresponding to application id: ", err);
        return;
    }
    
    try{
       let [rows,fields] = await Application.findById(applicationId);
       data = rows[0];

    }catch(err){
        req.flash('error','Try again later!');
        res.redirect('/admin/dashboard');
        console.log("Error in finding student data: ", err);
        return;
    }
    res.render('admin-panel/view-application',{docIds,data})
})

/**
 * For complete view of fdose certificate requested by admin
 */
router.get('/application/firstDose/:fdose_id',authenticate,async (req,res)=>{
    console.log("Reached /admin/application/firstDose/:fdose_id")
    let fdose_id = req.params.fdose_id;
    try{
        let [rows,fields] = await FirstDose.findByID(fdose_id);
        if(rows.length !=0){
            res.write(rows[0].FD_Document);
            res.end();
        }
    }
    catch(err) {
        req.flash('error','Try again later!');
        res.redirect('/admin/dashboard');
        console.log("Error in finding first dose certificate: ", err);
        return;
    }
})

/**
 * For complete view of sdose certificate requested by admin
 */
router.get('/application/secondDose/:sdose_id',authenticate,async (req,res)=>{
    console.log("Reached /admin/application/secondDose/:sdose_id")
    let sdose_id = req.params.sdose_id;
    try{
        let [rows,fields] = await SecondDose.findByID(sdose_id);
        if(rows.length !=0){
            res.write(rows[0].FD_Document);
            res.end();
        }
    }
    catch(err) {
        req.flash('error','Try again later!');
        res.redirect('/admin/dashboard');
        console.log("Error in finding second dose certificate: ", err);
        return;
    }
})

/**
 * For complete view of rtpcr certificate requested by admin
 */
router.get('/application/rtpcr/:rtpcr_id',authenticate,async (req,res)=>{
    console.log("Reached /admin/application/rtpcr/:rtpcr_id")
    let Rtpcr_id = req.params.rtpcr_id;
    try{
        let [rows,fields] = await Rtpcr.findByID(Rtpcr_id);
        if(rows.length !=0){
            res.write(rows[0].FD_Document);
            res.end();
        }
    }
    catch(err) {
        req.flash('error','Try again later!');
        res.redirect('/admin/dashboard');
        console.log("Error in finding Rtpcr certificate: ", err);
        return;
    }
})
/**
 * For logging the admin out
 */
router.post('/logout',(req,res)=>{
    console.log("Reached /admin/logout post");
    if(req.session.admin === 1){
        req.session.admin = 0;
        res.redirect('/admin');
    }
})


module.exports = router;