const express = require('express');
const multer = require('multer');
const File = require("../model/file");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, Date.now() + '-' + fileName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf format allowed!'), false);
    }
  }
}).single("file");

router.get("/getAllFiles", async(req, res) => {
  try {
    const files = await File.find();
    return res.status(200).send({ message: 'File uploaded successfully', files: files });
  } catch (error) {
    return res.status(500).send({ message: 'Error in saving file to database.', error: error.message });
  }
});

router.post('/pdf/', upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file was uploaded' });
  }

  const url = req.protocol + '://' + req.get('host');

  // Create a new file entry in the database
  const newFile = new File({
    filePath: url + '/uploads/' + req.file.filename,
    uploadedOn: new Date().toISOString(),
    fileName: req.file.originalname,
    docNumber: req.body.docNumber
  });

  try {
    const savedFile = await newFile.save();
    return res.status(200).send({ message: 'File uploaded successfully', file: savedFile });
  } catch (error) {
    return res.status(500).send({ message: 'Error in saving file to database.', error: error.message });
  }
});

// Change export syntax
module.exports = router;
