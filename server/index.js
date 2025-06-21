require('dotenv').config();
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

// Global variable to reuse the pool
let pool;

sql.connect(dbConfig)
  .then((p) => {
    pool = p;
    console.log('✅ SQL Server connection successful!');

    // Start server *after* DB connects
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to SQL Server:', err);
  });

app.get('/api/photos', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Photos');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ /api/photos error:', err);
    res.status(500).send('Database error');
  }
});

app.get('/api/test-connection', async (req, res) => {
  try {
    // Just check if pool is connected
    if (pool) {
      res.send('✅ Connection to SQL Server is working!');
    } else {
      res.status(500).send('❌ No active SQL connection.');
    }
  } catch (err) {
    console.error('❌ /api/test-connection error:', err);
    res.status(500).send('❌ Failed to test connection.');
  }
});
