const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const cors = require('cors');
const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const app = express();

// ✅ Enable CORS for your frontend
app.use(cors({
  origin: 'https://kaylee-s-photo-website.onrender.com'
}));
app.options('*', cors()); // ✅ Preflight requests

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// ✅ AWS S3 setup
const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// ✅ Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ✅ POST /upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  const { firstName, lastName } = req.body;
  const file = req.file;

  if (!firstName || !lastName || !file) {
    return res.status(400).json({ message: 'Missing name or file' });
  }

  const fileExtension = path.extname(file.originalname);
  const s3Key = `uploads/${Date.now()}_${firstName}_${lastName}${fileExtension}`;
  const fileContent = fs.readFileSync(file.path);

  try {
    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: fileContent,
      ContentType: file.mimetype
    }));

    const s3URL = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Insert into User table
    const { data: userData, error: userError } = await supabase
      .from('User')
      .insert([{ FirstName: firstName, LastName: lastName }])
      .select();

    if (userError) throw userError;
    const userID = userData[0].UserID;

    // Insert into Picture table
    const { data: pictureData, error: pictureError } = await supabase
      .from('Picture')
      .insert([{ UserID: userID, S3url: s3URL }])
      .select();

    if (pictureError) throw pictureError;

    res.json({
      message: 'File uploaded successfully',
      photoUrl: s3URL,
      UserID: userID,
      PictureID: pictureData[0].PictureID
    });

  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  } finally {
    // Always delete temp file
    fs.unlink(file.path, () => {});
  }
});

// ✅ GET /photos route
app.get('/photos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Picture')
      .select(`
        S3url,
        User:UserID (
          FirstName,
          LastName
        )
      `);

    if (error) throw error;

    const formatted = data.map(item => ({
      S3url: item.S3url,
      FirstName: item.User.FirstName,
      LastName: item.User.LastName
    }));

    res.json(formatted);

  } catch (error) {
    console.error('Error fetching photos:', error.message);
    res.status(500).json({ message: 'Error fetching photos', error: error.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
