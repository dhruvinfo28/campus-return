const db = require('../middlewares/dbConnection');

class SecondDose{
    constructor(Sdose_id,FD_Document){
        this.Sdose_id = Sdose_id;
        this.FD_Document = FD_Document;
    }

    /**
     * Saves a SecondDose certificate of a particular student
     * @param rollNumber : Roll number of the student whose certificate we are uploading
     * @returns  a promise which after resolve gives the response from the database
     */
    async save(rollNumber){
        let saveQuery = "insert into Second_Dose(Sdose_id,FD_Document,student_roll_number) values(?,?,?);"
        return db.promise().query(saveQuery,[this.Sdose_id,this.FD_Document,rollNumber]);
    }

    /**
     * Fetches all secondDoseCertificates of given student
     * @param {*} rollNumber 
     * @returns promise which after resolve gives [rows,fields]
     */
    static async getSecondDoseCertificates(rollNumber){
        let findQuery = "select * from Second_Dose where student_roll_number = ?";
        return db.promise().query(findQuery,[rollNumber]);
    } 
}

module.exports = SecondDose;