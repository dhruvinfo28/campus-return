const db = require('../middlewares/dbConnection');

class Application{
    constructor(applicationStatus,applicationReview){
        this.applicationStatus = 0 || applicationStatus;
        this.applicationReview = applicationReview || "Under Review ";
    }

    async save(rollNumber){
        let saveQuery = "insert into Application(Application_status, student_roll_number,Application_review) values(?,?,?); ";
        return db.promise().query(saveQuery,[this.applicationStatus,rollNumber,this.applicationReview]);
    }

    
}

module.exports = Application;