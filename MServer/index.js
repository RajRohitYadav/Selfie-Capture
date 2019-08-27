
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require('fs');
const express = require('express')
const app = express();
const port = 1234;
const path = require('path');
const sizeOf = require('image-size');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({limit:"300mb", extended: true }));

const upload = multer({dest: "image/"});
app.put(
  "/upload",
  upload.single("image"),
  (req, res) => {
    try{
      /*If source is file*/
      if(req.file){
        let tmpFile = path.join(__dirname, "./image/"+req.file.filename);
        let finalFile = path.join(__dirname, "./image/"+req.file.originalname)
        fs.rename(tmpFile,finalFile,()=>{
          let dimensions = sizeOf(finalFile);
          res.status(200).json({success:true,"message":dimensions});
          console.log('Uploaded',finalFile);
        })
      }
      /*If source is base64 data*/
      else{
        let name = (Math.random()*1000000).toFixed(0);
        let imageSrc = req.body.image;
        let image = imageSrc.replace(/^data:image\/\w+;base64,/, "");
        let buf = new Buffer(image, 'base64');
        fs.writeFile('./image/'+name+'.jpg', buf,()=>{
          let dimensions = sizeOf(buf);
          res.status(200).json({success:false,"message":dimensions});
        });
      }
    }
    catch(err){
      console.log(err);
    }
  }
);

app.get('/', (req, res) => {console.log('here');res.send('Hello World!')})

//Listen port 1234
app.listen(port, () => console.log(`Server At: ${port}!`))
