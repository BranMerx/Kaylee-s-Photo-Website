const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { createClient } = require('@supabase/supabase-js'); // ← NEW
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

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

    // Insert user
    const { data: userData, error: userError } = await supabase
      .from('User')
      .insert([{ FirstName: firstName, LastName: lastName }])
      .select();

    if (userError) throw userError;
    const userID = userData[0].UserID;

    // Insert picture
    const { data: pictureData, error: pictureError } = await supabase
      .from('Picture')
      .insert([{ UserID: userID, S3url: s3URL }])
      .select();

    if (pictureError) throw pictureError;
    const PictureID = pictureData[0].PictureID;

    res.json({
      message: 'File uploaded successfully',
      photoUrl: s3URL,
      UserID: userID,
      PictureID: PictureID
    });

  } catch (error) {
    console.error('Error uploading file:', error.message);
    console.error(error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  } finally {
    // Delete temp file
    fs.unlinkSync(file.path);
  }
});

const PORT = process.env.PORT || 5342;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

//fetching photos and names from Supabase
// Fetch photos and names from Supabase
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

    // Flatten the nested User object
    const formattedPhotos = data.map(item => ({
      S3url: item.S3url,
      FirstName: item.User.FirstName,
      LastName: item.User.LastName
    }));

    res.json(formattedPhotos);
  } catch (error) {
    console.error('Error fetching photos:', error.message);
    res.status(500).json({ message: 'Error fetching photos', error: error.message });
  }
});
