const db = require('../middlewares/dbConnection');

class Application{
    constructor(applicationStatus){
        this.applicationStatus = applicationStatus || 'Under Review';
    }

    async save(rollNumber){
        let saveQuery = "insert into Application(Application_status, student_roll_number) values(?,?); ";
        return db.promise().query(saveQuery,[this.applicationStatus,rollNumber]);
    }

    
}

module.exports = Application;