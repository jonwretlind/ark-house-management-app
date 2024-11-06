const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

router.post('/echo', (req, res) => {
  res.json({ 
    received: req.body,
    method: req.method,
    headers: req.headers
  });
});

module.exports = router; 