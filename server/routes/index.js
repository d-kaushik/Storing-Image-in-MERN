var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

var url="mongodb://localhost:27017/KMPR"

const { promisify } = require('util');
const pipeline= promisify(require("stream").pipeline)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

const upload = multer();


router.post("/upload", upload.single("file"), async function(req, res, next) {
  const {
    file,
    body: { name }
  } = req;

  if(file.detectedFileExtension!=".jpeg") next(new Error("Invalid file type"))

  const fileName = name + file.detectedFileExtension;
  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`),
    MongoClient.connect(url,function(err,db){
    if(err) throw err;
    var dbo=db.db("image");
    var myobj={path:`E:/MERN project/image/server/public/images/${fileName}`}
    dbo.collection("customers").insertOne(myobj,function(err,res){
        if(err)throw err
        console.log("Document Inserted");
        db.close();
    })
})
    // E:/MERN project/image/server/public/images/
  );

  //res.send("File uploaded as " + fileName);
});
module.exports = router;
