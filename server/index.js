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

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION
});

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

app.post('/upload', upload.single('photo'), async (req, res) => {
  const { firstName, lastName } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No image uploaded' });

  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    const s3Data = await s3.upload(s3Params).promise();
    const imageUrl = s3Data.Location;

    await sql.connect(dbConfig);
    await sql.query`INSERT INTO Guests (FirstName, LastName, ImageUrl) VALUES (${firstName}, ${lastName}, ${imageUrl})`;

    res.json({ message: 'Upload successful', imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading or saving data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
