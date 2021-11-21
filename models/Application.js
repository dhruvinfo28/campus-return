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

    static async findByRollNumber(rollNumber){
        let findQuery = "select * from Application where student_roll_number = ?";
        return db.promise().query(findQuery,[rollNumber]);
    }
    
}

module.exports = Application;