//uploading files or images
 const multer = require("multer");


 const storage = multer.diskStorage({
     destination:(req,res, cb)=>{
    cb(null,"public/uploads");
    },
    filename:(r,file,cb)=>{
        cb(null,Date.now()  + file.originalname);

    }
 })

 module.exports = {storage};