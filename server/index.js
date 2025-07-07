require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

//AWS S3 configuration
AWS.config.update({
  accessKeyId: 'AKIAV2NS6RA6HLSVYKLL',
  secretAccessKey: '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',
  region: 'us-east-2'
});

const s3 = new AWS.S3();

const sqlConfig = {
  database: 'Kaylee_Quince',
  server: 'MERX_LAPT/SQLEXPRESS',
  options:{
    encrypt: true,
    trustServerCertificate: true // Use this if you're connecting to a local SQL Server
  }
}

//upload route

app.post('/upload', upload.single('photo'), async (req, res) => {
  const { firstName, lastName } = req.body;
  const photo = req.file;

  try{
    // Upload to S3
    const s3Params = {
      Bucket: 'kaylee-quince',
      Key: `photos/${Date.now()}_${photo.originalname}`,
      Body: photo.buffer,
      ContentType: photo.mimetype,
      ACL: 'public-read' // Make the file publicly readable
    };
    const s3Result = await s3.upload(s3Params).promise();
    const s3URL = s3Result.Location;

    //Save to SQL server
    await sql.connect(sqlConfig);
    const result = await sql.query`
      INSERT INTO [User] (FirstName, LastName)
      OUTPUT INSERTED.UserID
      VALUES (${firstName}, ${lastName})`;

    const userId = result.recordset[0].UserID;

    await sql.query`
      INSERT INTO[Picture] (UserID, S3URL)
      OUTPUT INSERTED.PictureID
      OUTPUT INSERTED.UploadDate
      VALUES (${userId}, ${s3URL})`;

    const pictureId = result.recordset[0].PictureID;
    const uploadDate = result.recordset[0].UploadDate;

    res.send('Upload successful'); 

  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
