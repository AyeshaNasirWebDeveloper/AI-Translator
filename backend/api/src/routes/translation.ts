import { Router } from 'express';
import { geminiService } from '../services/gemini';

const router = Router();

router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res
        .status(400)
        .json({ error: 'Missing required parameters: text and targetLanguage' });
    }

    const translatedText = await geminiService.translate(text, targetLanguage);
    const audioData = await geminiService.textToSpeech(translatedText);

    res.json({
      translatedText,
      audioData,
    });
  } catch (error) {
    console.error('Error in translation route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
