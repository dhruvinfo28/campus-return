const db = require('../middlewares/dbConnection');

class FirstDose{
    constructor(Fdose_id,FD_Document){
        this.Fdose_id =Fdose_id;
        this.FD_Document = FD_Document;
    }

    /**
     * Saves a FirstDose certificate of a particular student
     * @param rollNumber : Roll number of the student whose certificate we are uploading
     * @returns  a promise which after resolve gives the response from the database
     */
    async save(rollNumber){
        let saveQuery1 = "insert into First_Dose_A(Fdose_id,FD_Document) values(?,?);"
        let saveQuery2 = "insert into First_Dose_B(Fdose_id,student_roll_number) values(?,?);"
        return db.promise().query(saveQuery1 + saveQuery2,[this.Fdose_id,this.FD_Document,this.Fdose_id,rollNumber]);
    }

    /**
     * Fetches all firstDoseCertificates of given student
     * @param {*} rollNumber 
     * @returns promise which after resolve gives [rows,fields]
     */
    static async getFirstDoseCertificates(rollNumber){
        let findQuery = "select a.Fdose_id, a.FD_Document, b.student_roll_number "+
                        "from first_dose_a as a "+
                        "inner join first_dose_b as b "+ 
                        "on a.Fdose_id = b.Fdose_id "+
                        "where b.student_roll_number = ?;"
        return db.promise().query(findQuery,[rollNumber]);
    } 
}

module.exports = FirstDose;