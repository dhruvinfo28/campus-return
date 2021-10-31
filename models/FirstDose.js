const db = require('../middlewares/dbConnection');

class FirstDose{
    constructor(Fdose_id,FD_Document,BId){
        this.Fdose_id =Fdose_id;
        this.FD_Document = FD_Document;
        this.BId = BId;
    }

    /**
     * Saves a FirstDose certificate of a particular student
     * @param rollNumber : Roll number of the student whose certificate we are uploading
     * @returns  a promise which after resolve gives the response from the database
     */
    async save(rollNumber){
        let saveQuery = "insert into First_Dose(Fdose_id,FD_Document,student_roll_number,Benificiary_Id) values(?,?,?,?);"
        return db.promise().query(saveQuery,[this.Fdose_id,this.FD_Document,rollNumber,this.BId]);
    }

    /**
     * Fetches all firstDoseCertificates of given student
     * @param {*} rollNumber 
     * @returns promise which after resolve gives [rows,fields]
     */
    static async getFirstDoseCertificates(rollNumber){
        let findQuery = "select * from First_Dose where student_roll_number = ?";
        return db.promise().query(findQuery,[rollNumber]);
    } 
}

module.exports = FirstDose;