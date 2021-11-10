const db = require('../middlewares/dbConnection');

class Rtpcr{
    constructor(RtpcrId, FD_Document){
        this.RtpcrId = RtpcrId;
        this.FD_Document = FD_Document;
    }

    async save(rollNumber){
        let saveQuery = "insert into rtpcr(Rtpcr_id, FD_Document,student_roll_number) values(?,?,?)";
        return db.promise().query(saveQuery,[this.RtpcrId, this.FD_Document,rollNumber]);
    }

    static async findByRollNumber(rollNumber){
        let findQuery = "select * from rtpcr where student_roll_number = ?";
        return db.promise().query(findQuery,[rollNumber]);
    }

}

module.exports = Rtpcr;