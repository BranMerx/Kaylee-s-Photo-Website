const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sql = require('mssql');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// AWS S3 client
const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// MSSQL config
const sqlConfig = {
  server: process.env.DB_SERVER, // use just the hostname, not \SQLEXPRESS here
  database: process.env.DB_DATABASE,
  authentication: {
    type: 'ntlm',
    options: {
      domain: process.env.DB_DOMAIN || 'Merx_LapT', // use your computer name
      userName: '', // empty means use current Windows user
      password: ''  // also empty for Windows Auth
    }
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

// Connect to MSSQL *once* on server start
sql.connect(sqlConfig)
  .then((p) => {
    pool = p;
    console.log('Connected to MSSQL');
    
    // Start the server only after DB is ready
    app.listen(8080, () => {
      console.log('Server running on port 8080');
    });
  })
  .catch(err => {
    console.error('MSSQL connection error:', err);
    process.exit(1); // Exit if DB fails to connect
  });

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  const { firstName, lastName } = req.body;
  const file = req.file;

  if (!firstName || !lastName || !file) {
    return res.status(400).json({ message: 'Missing name or file' });
  }

  const fileContent = fs.readFileSync(file.path);
  const fileExtension = path.extname(file.originalname);
  const s3Key = `uploads/${Date.now()}_${firstName}_${lastName}${fileExtension}`;

  try {
    // Upload file to S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: fileContent,
      ContentType: file.mimetype
    }));

    const s3URL = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Insert into User table
    const userResult = await pool.request()
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .query(`
        INSERT INTO [User] (FirstName, LastName)
        VALUES (@firstName, @lastName);

        SELECT SCOPE_IDENTITY() AS UserID;
      `);

    const userId = userResult.recordset[0].UserID;

    // Insert into Picture table
    const pictureResult = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('s3URL', sql.NVarChar, s3URL)
      .query(`
        INSERT INTO Picture (UserID, S3url, UploadDate)
        VALUES (@UserID, @s3URL, GETDATE());

        SELECT SCOPE_IDENTITY() AS PictureID;
      `);

    const pictureId = pictureResult.recordset[0].PictureID;

    res.json({
      message: 'File uploaded successfully',
      photoUrl: s3URL,
      userId,
      pictureId
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  } finally {
    // Delete temporary uploaded file
    fs.unlinkSync(file.path);
  }
});
