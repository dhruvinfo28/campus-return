const multer = require('multer')

const storage = multer.diskStorage({
    destination:`${__dirname}/../resources`,
    filename:(req,file,cb)=>{
        const filename = Date.now() + '-' + file.originalname
        cb(null,filename);
    }
});

module.exports = multer({storage:storage})