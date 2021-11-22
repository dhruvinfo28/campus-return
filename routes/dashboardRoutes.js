const express = require('express');
const fs = require('fs')
const crypto = require('crypto')

const Student = require('../models/Student');
const checkLoginStatus = require('../utilityFunctions/checkLoginStatus')
const upload = require('../middlewares/multerConfig');
const FirstDose = require('../models/FirstDose');
const SecondDose = require('../models/SecondDose');
const Rtpcr = require('../models/Rtpcr')
const Application = require('../models/Application')

const router = express.Router();

router.use(checkLoginStatus);

/**
 * Handles a get request for student dashboard
 */
router.get('/', async (req, res) => {
    console.log("Reached /dashboard get");
    let lastApplicationStatus;
    let lastApplicationReview;
    try{
        console.log(req.session.student.rollNumber);
        let [rows,fields] = await Application.findLastApplicationStatus(req.session.student.rollNumber);
        if(rows.length==0){
            lastApplicationStatus = 'No application submitted yet!';
        }else{
            console.log(rows);
            lastApplicationStatus = rows[0].application_status;
            lastApplicationReview = rows[0].application_review;
        }
    }catch(err){
       console.log(err);
    }
    res.render('Dashboard', { student: req.session.student, error: req.flash('error'),lastApplicationStatus,lastApplicationReview});
})

/**
 * Handles upload of FirstDose Certificate:
 */
router.post('/uploadFirstDose', upload.single('fDoseCertificate'), async (req, res) => {
    console.log("Reached /dashboard/uploadFirstDose post");
    let data;
    try {
        data = await fs.readFileSync(`${__dirname}/../resources/${req.file.filename}`);
    } catch (fsError) {
        console.log("Error in uploading file to server", fsError);
        req.flash('error', 'Error in uploading document! Try again later');
        res.redirect('/dashboard');
        return;
    }
    let fd = new FirstDose(req.file.filename, data);
    try {
        let dbResponse = await fd.save(req.session.student.rollNumber);
        console.log(dbResponse);
        req.flash('error', 'Upload complete');
        res.redirect('/dashboard');
    } catch (uploadError) {
        console.log("Error in saving to First_Dose: ", uploadError);
        req.flash('error', 'Error in uploading document! Try again later');
        res.redirect('/dashboard');
    }
    fs.unlink(`${__dirname}/../resources/${req.file.filename}`, (err) => {
        if (err) console.log("First Dose delete fail: ", err);
        else console.log(req.file.filename, " deleted");
    });
})

/**
 * Handles get request to view last firstDose Certificate
 */
router.get('/viewFirstDose', async (req, res) => {
    console.log("Reached dashboard/viewFirstDose get");
    let data;
    try {
        data = await FirstDose.getFirstDoseCertificates(req.session.student.rollNumber);
    } catch (err) {
        console.log("Error in fetching first dose certificates: ", err);
        req.flash('Please try again later');
        res.redirect('/dashboard');
        return;
    }
    let [rows, fields] = data;
    if (rows.length == 0) {
        req.flash('error', 'No first dose certificate found');
        res.redirect('/dashboard');
    }
    else {
        let certificate = rows[rows.length - 1].FD_Document;
        res.write(certificate);
        res.end();
    }
})

/**
 * To handle post request for second dose certificate upload
 */
router.post('/uploadSecondDose', upload.single('sDoseCertificate'), async (req, res) => {
    console.log("Reached /dashboard/uploadSecondDose post");
    let data;
    try {
        data = await fs.readFileSync(`${__dirname}/../resources/${req.file.filename}`);
    } catch (fsError) {
        console.log("Error while reading second dose certificate from server!", fsError);
        req.flash('error', "Please try again later");
        res.redirect('/dashboard');
        return;
    }

    let fd = new SecondDose(req.file.filename, data);
    try {
        let dbResponse = fd.save(req.session.student.rollNumber);
        console.log(dbResponse);
        req.flash('error', 'Upload complete');
    } catch (err) {
        console.log("Error while saving second dose certificate!", err);
        req.flash('error', 'Please try again later');
    }
    res.redirect('/dashboard');
    fs.unlink(`${__dirname}/../resources/${req.file.filename}`, (err) => {
        if (err) console.log("First Dose delete fail: ", err);
        else console.log(req.file.filename, " deleted");
    });

})


/**
 * Handles get request to view last firstDose Certificate
 */
router.get('/viewSecondDose', async (req, res) => {
    let data;
    try {
        data = await SecondDose.getSecondDoseCertificates(req.session.student.rollNumber);
    } catch (err) {
        console.log("Error fetching second dose certificates! ", err);
        req.flash('error', 'Try again later');
        res.redirect('/dashboard');
        return;
    }
    let [rows, fields] = data;
    if (rows.length == 0) {
        req.flash('error', 'No second dose certificate found');
        res.redirect('/dashboard');

    } else {
        let certi = rows[rows.length - 1].FD_Document;
        res.write(certi);
        res.end();
    }
})

/**
 * To handle upload of RTPCR certificate
 */
router.post('/uploadRtpcr', upload.single('rtpcrCertificate'), async (req, res) => {
    console.log("Reached /dashboard/uploadRtpcr post");
    let data;
    let path = `${__dirname}/../resources/${req.file.filename}`;
    try {
        data = await fs.readFileSync(path);
    } catch (FileReadError) {
        console.log("Error in reading rtpcr from the server!", FileReadError);
        req.flash('error', 'Please try again later');
        res.redirect('/dashboard');
        return;
    }

    let pk;
    try {
        pk = await crypto.randomBytes(16).toString("hex");
    } catch (tokenGenerationError) {
        console.log("Cannot generate primary key form rtpcr: ", tokenGenerationError);
        req.flash('error', 'Plese try again later! ');
        res.redirect('/dashboard');
        return;
    }

    let fd = new Rtpcr(pk, data);

    try {
        const dbResponse = await fd.save(req.session.student.rollNumber);
        console.log("RTPCR saved: ", dbResponse);
        req.flash('error', 'RTPCR certificate saved');
        res.redirect('/dashboard');
    } catch (dbError) {
        console.log("Can't save RTPCR report to db:", dbError);
        req.flash('error', 'Try again later!');
        res.redirect('/dashboard');
    }

    fs.unlink(path, (err) => {
        if (err) {
            console.log("Can't delete local copy of RTPCR, ", err);
        } else {
            console.log("Local Rtpcr deleted");
        }
    })
})

/**
 * To handle view request for Rtpcr 
 */
router.get('/viewRtpcr', async (req, res) => {
    console.log("Reached /dashboard/viewRtpcr get");
    let rN = req.session.student.rollNumber;
    let data;

    try {
        data = await Rtpcr.findByRollNumber(rN);
    } catch (dbError) {
        console.log("Error in finding Rtpcr certificate! ", dbError);
        req.flash('error', 'Please try to view later!');
        res.redirect('/dashboard');
        return;
    }
    let [rows, fields] = data;
    if (rows.length == 0) {
        req.flash('error', 'No RTPCR found!');
        res.redirect('/dashboard');
    }
    else {
        res.write(rows[rows.length - 1].FD_Document);
        res.end();
    }


})

/**
 * For submitting an application
 */
router.get('/makeApplication', async (req, res) => {
    console.log("Reached /dashboard/makeApplication get");
    let application = new Application(0, 'Under Review');
    try {
        let result = await application.save(req.session.student.rollNumber);
        console.log("Application saved with response: ", result);
        req.flash('error', 'Application submitted');
        res.redirect('/dashboard');
    } catch (err) {
        console.log('Error in saving an application!', err);
        req.flash('error', 'Try submitting the application later.');
        res.redirect('/dashboard');
        return;
    }
})

/**
 * To view First Dose certificate from last application
 */

router.get('/viewApplicationFirstDose', async (req, res) => {
    console.log("Reached /dashboard/viewAppicationFirstDose get");

    let requiredApplicationId;
    let requiredFdoseId;

    //Finding requiredApplicationId from rollNumber
    try {
        let [rows, fields] = await Application.findByRollNumber(req.session.student.rollNumber);
        if (rows.length == 0) {
            console.log("No application found");
            req.flash('error', "You haven't submitted any application yet");
            res.redirect('/dashboard');
            return;
        }
        requiredApplicationId = rows[rows.length - 1].Application_id;
    }
    catch (applicationFindError) {
        console.log("Cannot find applications by roll number: ", applicationFindError);
        req.flash('error', 'Try to view later');
        res.redirect('/dashboard');
        return;
    }

    // Finding requiredFdoseId from requiredApplicationId
    try {
        let [rows, fields] = await FirstDose.findByApplicationId(requiredApplicationId);
        if (rows.length == 0) {
            console.log("No corresponding first dose certificate");
            req.flash('error', 'No corresponding first dose certificate');
            res.redirect('/dashboard');
            return;
        }
        requiredFdoseId = rows[0].Fdose_id;
    } catch (FdoseAppFindErr) {
        console.log("Error in finding Fdose_id by application ID: ", FdoseAppFindErr);
        req.flash('error', 'Try to view later');
        res.redirect('/dashboard');
        return;
    }

    try {
        let [rows, fields] = await FirstDose.findByID(requiredFdoseId);
        if (rows.length == 0) {
            req.flash('error', 'First Dose document for this application not found!');
            res.redirect('/dashboard');
        } else {
            res.write(rows[0].FD_Document);
            res.end();
        }
    } catch (findFdoseByIderror) {
        console.log("First Dose Find By Id error: ", findFdoseByIderror);
        req.flash('error', 'Try again later');
        res.redirect('/dashboard');
    }

})


/**
 * To view second_dose_certificate of last application
 */

router.get('/viewApplicationSecondDose', async (req, res) => {
    console.log("Reached /dashboard/viewAppicationSecondDose get");

    let requiredApplicationId;
    let requiredSdoseId;

    //Finding requiredApplicationId from rollNumber
    try {
        let [rows, fields] = await Application.findByRollNumber(req.session.student.rollNumber);
        if (rows.length == 0) {
            console.log("No application found");
            req.flash('error', "You haven't submitted any application yet");
            res.redirect('/dashboard');
            return;
        }
        requiredApplicationId = rows[rows.length - 1].Application_id;
    }
    catch (applicationFindError) {
        console.log("Cannot find applications by roll number: ", applicationFindError);
        req.flash('error', 'Try to view later');
        res.redirect('/dashboard');
        return;
    }

    //Find requiredSdoseId from requiredApplicationId
    try {
        let [rows, fields] = await SecondDose.findByApplicationId(requiredApplicationId);
        if (rows.length == 0) {
            console.log("No corresponding second dose certificate");
            req.flash('error', 'No corresponding second dose certificate');
            res.redirect('/dashboard');
            return;
        }
        requiredSdoseId = rows[0].Sdose_id;
    } catch (SdoseAppFindErr) {
        console.log("Error in finding Sdose_id by application ID: ", SdoseAppFindErr);
        req.flash('error', 'Try to view later');
        res.redirect('/dashboard');
        return;
    }

    try {
        let [rows, fields] = await SecondDose.findByID(requiredSdoseId);
        if (rows.length == 0) {
            req.flash('error', 'Second Dose document for this application not found!');
            res.redirect('/dashboard');
        } else {
            res.write(rows[0].FD_Document);
            res.end();
        }
    } catch (findSdoseByIderror) {
        console.log("Second Dose Find By Id error: ", findSdoseByIderror);
        req.flash('error', 'Try again later');
        res.redirect('/dashboard');
    }
})

/**
 * To view rtpcr of last application
 */
router.get('/viewApplicationRtpcr', async (req, res) => {
    console.log("Reached /dashboard/viewAppicationRtpcr get");

    let requiredApplicationId;
    let requiredRtpcrId;

    //Finding requiredApplicationId from rollNumber
    try {
        let [rows, fields] = await Application.findByRollNumber(req.session.student.rollNumber);
        if (rows.length == 0) {
            console.log("No application found");
            req.flash('error', "You haven't submitted any application yet");
            res.redirect('/dashboard');
            return;
        }
        requiredApplicationId = rows[rows.length - 1].Application_id;
    }
    catch (applicationFindError) {
        console.log("Cannot find applications by roll number: ", applicationFindError);
        req.flash('error', 'Try to view later');
        res.redirect('/dashboard');
        return;
    }

    //Find requiredSdoseId from requiredApplicationId
    try {
        let [rows, fields] = await Rtpcr.findByApplicationId(requiredApplicationId);
        if (rows.length == 0) {
            console.log("No corresponding Rtpcr certificate");
            req.flash('error', 'No corresponding Rtpcr certificate');
            res.redirect('/dashboard');
            return;
        }
        requiredRtpcrId = rows[0].Rtpcr_id;
    } catch (RtpcrAppFindErr) {
        console.log("Error in finding Rtpcr_id by application ID: ", RtpcrAppFindErr);
        req.flash('error', 'Try to view later');
        res.redirect('/dashboard');
        return;
    }

    try {
        let [rows, fields] = await Rtpcr.findByID(requiredRtpcrId);
        if (rows.length == 0) {
            req.flash('error', 'Rtpcr document for this application not found!');
            res.redirect('/dashboard');
        } else {
            res.write(rows[0].FD_Document);
            res.end();
        }
    } catch (findRtpcrByIderror) {
        console.log("Rtpcr Find By Id error: ", findRtpcrByIderror);
        req.flash('error', 'Try again later');
        res.redirect('/dashboard');
    }
})

module.exports = router;