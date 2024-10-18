// routes/aiImageRoutes.js
import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const aiImageRoutes = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate AI image based on task name and description
aiImageRoutes.post('/generate-image', async (req, res) => {
  const { taskName, description } = req.body;

  try {
    const prompt = `${taskName}: ${description}`;
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '512x512', // Specify image size
    });

    const imageUrl = response.data.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Failed to generate image', error });
  }
});

export default aiImageRoutes;
