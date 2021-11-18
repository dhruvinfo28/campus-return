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
        let saveQuery1 = "insert into Second_Dose_A(Sdose_id,FD_Document) values(?,?);"
        let saveQuery2 = "insert into Second_Dose_B(Sdose_id,student_roll_number) values(?,?);"
        return db.promise().query(saveQuery1+saveQuery2,[this.Sdose_id,this.FD_Document,this.Sdose_id,rollNumber]);
    }

    /**
     * Fetches all secondDoseCertificates of given student
     * @param {*} rollNumber 
     * @returns promise which after resolve gives [rows,fields]
     */
    static async getSecondDoseCertificates(rollNumber){
        let findQuery = "select a.Sdose_id, a.FD_Document, b.student_roll_number "+
                        "from second_dose_a as a "+
                        "inner join second_dose_b as b "+
                        "on a.Sdose_id = b.Sdose_id "+
                        "where b.student_roll_number = ?"
        return db.promise().query(findQuery,[rollNumber]);
    } 
}

module.exports = SecondDose;