const express = require('express');
const app = express();

app.use('/uploads', express.static('uploads'));

// ... rest of the code remains the same 