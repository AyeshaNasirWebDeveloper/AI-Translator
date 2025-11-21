import {
  GoogleGenerativeAI,
  Content,
  Part,
} from '@google/generative-ai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private textToSpeech: TextToSpeechClient;
  private transcriptionModel: string;
  private translationModel: string;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.textToSpeech = new TextToSpeechClient();
    this.transcriptionModel = 'gemini-pro';
    this.translationModel = 'gemini-pro';
  }

  setTranscriptionModel(model: string) {
    this.transcriptionModel = model;
  }

  setTranslationModel(model: string) {
    this.translationModel = model;
  }

  async transcribe(audioChunk: any): Promise<string> {
    console.log('GeminiService: Transcribing audio chunk...');
    const audioFilePath = 'temp_audio.wav';
    fs.writeFileSync(audioFilePath, audioChunk);

    const model = this.genAI.getGenerativeModel({ model: this.transcriptionModel });
    const audioBytes = fs.readFileSync(audioFilePath).toString('base64');

    const audioPart: Part = {
      inlineData: {
        mimeType: 'audio/wav',
        data: audioBytes,
      },
    };

    const prompt = 'Transcribe the following audio:';
    const result = await model.generateContent([prompt, audioPart]);
    const response = result.response;
    const text = response.text();

    fs.unlinkSync(audioFilePath);
    console.log(`GeminiService: Transcription result: "${text}"`);
    return text;
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    console.log(
      `GeminiService: Translating text to "${targetLanguage}"...`
    );
    const model = this.genAI.getGenerativeModel({ model: this.translationModel });
    const prompt = `Translate the following text to ${targetLanguage}: ${text}`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const translation = response.text();
    console.log(`GeminiService: Translation result: "${translation}"`);
    return translation;
  }

  async textToSpeech(text: string): Promise<any> {
    console.log('GeminiService: Synthesizing speech from text...');
    const request = {
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };
    const [response] = await this.textToSpeech.synthesizeSpeech(request);
    console.log('GeminiService: Speech synthesis complete.');
    return response.audioContent;
  }
}

export const geminiService = new GeminiService(
  process.env.GEMINI_API_KEY || ''
);
