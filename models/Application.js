const db = require('../middlewares/dbConnection');
const FirstDose = require('./FirstDose');

class Application{
    constructor(applicationStatus,applicationReview){
        this.applicationStatus = 0 || applicationStatus;
        this.applicationReview = applicationReview || "Under Review ";
    }

    async save(rollNumber){
        let saveQuery = "insert into Application(Application_status, student_roll_number,Application_review) values(?,?,?); ";
        return db.promise().query(saveQuery,[this.applicationStatus,rollNumber,this.applicationReview]);
    }

    static async findByRollNumber(rollNumber){
        let findQuery = "select * from Application where student_roll_number = ?";
        return db.promise().query(findQuery,[rollNumber]);
    }

    static async findAll(){
        let findQuery = "select application.application_id,application.application_status, application.application_review, " + 
                        "student.student_roll_number,student.student_name,student.student_branch,student.student_year,student.student_programme,student.student_email_id "+
                        "from application "+
                        "inner join student "+
                        "on application.student_roll_number = student.student_roll_number "+
                        "order by application.application_id;";

        return db.promise().query(findQuery);
    }

    /**
     * 
     * @param {*} applicationId 
     * @returns Ids of documents associated with the required application_id
     */
    static async findCertificateIdsByApplicationId(applicationId){
        let findQuery1 = "select "+ 
                        "application.application_id, application.application_status, application.application_review, "+
                        "fd.Fdose_id "+
                        "from application "+
                        "inner join has_certificate_of_fd as fd on application.Application_id = fd.Application_id "+
                        "where application.application_id = ?;" ;
        let findQuery2 = "select "+ 
                        "application.application_id, application.application_status, application.application_review, "+
                        "sd.Sdose_id "+
                        "from application "+
                        "inner join has_certificate_of_sd as sd on application.Application_id = sd.application_id "+
                        "where application.application_id = ?;" ;

        let findQuery3 = "select "+ 
                        "application.application_id, application.application_status, application.application_review, "+
                        "rtpcr.Rtpcr_id "+
                        "from application "+
                        "inner join has_report_of as rtpcr on application.Application_id = rtpcr.application_id "+
                        "where application.application_id = ?;" ;
        
        let fdose_id='-1',sdose_id='-1',rtpcr_id='-1';

        //Finding first dose
        try{
            let [rows,fields] = await db.promise().query(findQuery1,[applicationId]);
            if(rows.length != 0){
                fdose_id = rows[0].Fdose_id;
            }
        }catch(err){
            console.log("Error in finding application and firstDose_id by applicationid: ",applicationId);
            throw new Error(err);
        }

        //Finding second dose
        try{
            let [rows,fields] = await db.promise().query(findQuery2,[applicationId]);
            if(rows.length != 0){
                sdose_id = rows[0].Sdose_id;
            }
        }catch(err){
            console.log("Error in finding application and secondDoseid by applicationid: ",applicationId);
            throw new Error(err);
        }

        //Finding third dose
        try{
            let [rows,fields] = await db.promise().query(findQuery3,[applicationId]);
            if(rows.length != 0){
                rtpcr_id = rows[0].Rtpcr_id;
            }
        }catch(err){
            console.log("Error in finding application and Rtpcr by applicationid: ",applicationId);
            throw new Error(err);
        }
        return [fdose_id,sdose_id,rtpcr_id];
    }
    
    static async findById(application_id){
        let findQuery = "select application.application_id,application.application_status, application.application_review, " + 
                        "student.student_roll_number,student.student_name,student.student_branch,student.student_year,student.student_programme,student.student_email_id "+
                        "from application "+
                        "inner join student "+
                        "on application.student_roll_number = student.student_roll_number "+
                        "where application.application_id = ?;";

        return db.promise().query(findQuery,[application_id]);
    }

    static async updateReview(application_id,status,review){
        let updateQuery = "update application set application_status = ?, application_review = ? "+
        "where application_id = ?";
        return db.promise().query(updateQuery,[status,review,application_id]);
    }
}

module.exports = Application;