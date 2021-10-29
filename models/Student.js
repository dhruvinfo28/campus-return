const db = require('../middlewares/dbConnection');

class Student {
    constructor(rollNumber, name, branch, emailId, yearOfGrad, programme,token,password) {
        this.rollNumber = rollNumber || null;
        this.name = name || null;
        this.branch = branch || null;
        this.emailId = emailId || null;
        this.password = password || null;
        this.yearOfGrad = yearOfGrad || null;
        this.programme = programme || null;
        this.token = token || null;
        this.verificationStatus = 0;
    }

    /**
     * To save a Student object in the student database
     * @returns a promise, that when resolved saves a student into the database
     */
    save() {
        const insertQuery = "insert into student values(" +
            "?,?,?,?,?,?,?,?,?);";
        return db.promise().query(insertQuery, [this.rollNumber, this.name, this.branch, this.emailId, this.password, this.yearOfGrad, this.programme,this.token, this.verificationStatus]);
    }

    /**
     * Finding a student by rollNumber
     * @param {rollNumber} obj -> Roll number of the student to be found
     * @returns a promise,that when resolved returns an array [rows,fields] 
     * -> rows containing the required students and fields containing meta data about columns
     */
    static async findByRollNumber(obj) {
        let rN = obj.rollNumber;
        let findQuery = "select * from student " +
            "where student_roll_number = ?;";
        return db.promise().query(findQuery, [rN]);
    }

    /**
     * Find all Student records
     * @returns a promise,that when resolved returns an array [rows,fields] 
     * -> rows containing all students and fields containing meta data about columns
     */
    static async findAll() {
        let findQuery = "select * from student";
        return db.promise().query(findQuery);
    }

    static async setVerifiedByToken(token){
        let updateQuery = "update student set student_verified_status=? where student_token = ?";
        return db.promise().query(updateQuery,[1,token]);
    }
}

module.exports = Student;