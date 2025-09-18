const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 3000; // Ganti sesuai kebutuhan

app.get('/checkkey', async (req, res) => {
  const key = req.query.key;
  if (!key) {
    return res.status(400).json({ status: 'error', message: 'No key provided' });
  }

  try {
    const response = await axios.get(`https://work.ink/_api/v2/token/isValid/${key}`);
    const data = response.data;

    if (!data.valid) {
      return res.status(401).json({ status: 'error', message: 'Invalid or used token' });
    }

    const currentTime = Date.now();
    const expiresAt = parseInt(data.expiresAfter);

    if (expiresAt && currentTime > expiresAt) {
      return res.status(401).json({ status: 'error', message: 'Token expired' });
    }

    // ✅ Token valid dan belum expired
    return res.status(200).json({ status: 'success', message: 'Token valid' });

  } catch (err) {
    console.error('Work.ink API error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Server error validating key' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
