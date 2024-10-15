// routes/auth.js
import express from 'express';
import { register, login } from '../controllers/authController.js';  // Import the controller functions

const router = express.Router();

// Route to register a new user
router.post('/register', register);

// Route to log in an existing user
router.post('/login', login);

export default router;
