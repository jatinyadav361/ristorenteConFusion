const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

// Configuring multer for uploading files

// configuring multer for destination and filename for the files uploaded on the server side
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        //cb is callback function
        cb(null,'public/images');
    },
    filename : (req,file,cb) => {
        cb(null, file.originalname);
    }
});

// configuring option for multer to only allow image files to be uploaded 
const imageFilter = (req,file,cb) => {
    if(!file.originalname.match("\.(jpg|jpeg|png|gif)$")) {
        cb(new Error("Only images can be uploaded!"),false);
    }
    else {
        cb(null,true);
    }
};

const upload = multer({storage : storage, fileFilter : imageFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser,authenticate.verifyAdmin, upload.single('imageFile') ,(req,res,next) => {
    // upload.single('imageFile') will populate the Request object with a file object containing information
    // about the processed file.
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;