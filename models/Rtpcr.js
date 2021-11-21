const db = require('../middlewares/dbConnection');

class Rtpcr{
    constructor(RtpcrId, FD_Document){
        this.RtpcrId = RtpcrId;
        this.FD_Document = FD_Document;
    }

    async save(rollNumber){
        let saveQuery1 = "insert into rtpcr_a(Rtpcr_id, FD_Document) values(?,?);";
        let saveQuery2 = "insert into rtpcr_b(Rtpcr_id, student_roll_number) values(?,?);";
        return db.promise().query(saveQuery1+saveQuery2,[this.RtpcrId, this.FD_Document,this.RtpcrId,rollNumber]);
    }

    static async findByRollNumber(rollNumber){
        let findQuery = "select a.Rtpcr_id, a.FD_Document, b.student_roll_number "+
                        "from rtpcr_a as a "+
                        "inner join rtpcr_b as b "+ 
                        "on a.rtpcr_id = b.rtpcr_id "+
                        "where b.student_roll_number = ?;"
        return db.promise().query(findQuery,[rollNumber]);
    }

    static async findByApplicationId(application_id){
        let findQuery = "select Rtpcr_id from has_report_of where Application_id = ?";
        return db.promise().query(findQuery,[application_id]);
    }

    static async findByID(Rtpcr_id){
        let findQuery = "select a.Rtpcr_id, a.FD_Document, b.student_roll_number "+
                        "from rtpcr_a as a "+
                        "inner join rtpcr_b as b "+ 
                        "on a.Rtpcr_id = b.Rtpcr_id "+
                        "where a.Rtpcr_id = ?";
        return db.promise().query(findQuery,[Rtpcr_id]);

    }
}

module.exports = Rtpcr;