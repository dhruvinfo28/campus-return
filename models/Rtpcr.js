const db = require('../middlewares/dbConnection');

class Rtpcr{
    constructor(RtpcrId, FD_Document, Expiration_Date){
        this.RtpcrId = RtpcrId;
        this.FD_Document = FD_Document;
        this.Expiration_Date = Expiration_Date;
    }

    async save(rollNumber){
        let saveQuery = "insert into rtpcr(Rtpcr_id, FD_Document,Expiration_Date,student_roll_number) values(?,?,?,?)";
        return db.promise().query(saveQuery,[this.RtpcrId, this.FD_Document,this.Expiration_Date,rollNumber]);
    }

    static async findByRollNumber(rollNumber){
        let findQuery = "select * from rtpcr where student_roll_number = ?";
        return db.promise().query(findQuery,[rollNumber]);
    }

}

module.exports = Rtpcr;