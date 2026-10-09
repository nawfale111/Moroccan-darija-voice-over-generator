import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY is not defined in process.env. Gemini calls will require key configuration.');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Map of tone to acoustic delivery direction
const TONE_DIRECTIONS: Record<string, string> = {
  hype: 'High-energy, fast-paced, exciting, vibrant social media commercial hype with passionate vocal punch and dynamic inflection.',
  professional: 'Polished, authoritative, articulate, corporate narrator delivery. Crisp diction, reassuring tone, and executive clarity.',
  dramatic: 'Cinematic, deep, theatrical, trailer-style delivery with suspenseful pauses, resonant vocal weight, and compelling gravitas.',
  emotional: 'Warm, heartfelt, intimate, empathetic and inspiring commercial storytelling that connects deeply with the listener.',
  sales_driven: 'High-conversion, urgent, persuasive sales pitch. Punchy call-to-action emphasis, confident rhythm, and compelling FOMO cadence.',
};

const LANGUAGE_DIRECTIONS: Record<string, string> = {
  moroccan_darija:
    'Authentic Moroccan Arabic (الدارجة المغربية) voiceover. Fluent native Moroccan accent, natural pronunciation of Darija vernacular, local commercial cadence.',
  modern_standard_arabic:
    'Flawless Modern Standard Arabic (العربية الفصحى) commercial voiceover. Clear articulation, accurate diacritics and vowels, authoritative broadcasting standard.',
};

/**
 * Generate Voiceover Audio
 */
app.post('/api/voiceover/generate', async (req, res) => {
  try {
    const {
      script,
      language = 'moroccan_darija',
      voice = 'Kore',
      tone = 'sales_driven',
      rate = 1.0,
      emphasis = 'punchy',
    } = req.body;

    if (!script || typeof script !== 'string' || !script.trim()) {
      return res.status(400).json({ error: 'Marketing script text is required.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your environment variables.',
      });
    }

    // Build rich speech style prompt
    const toneDesc = TONE_DIRECTIONS[tone] || TONE_DIRECTIONS.sales_driven;
    const langDesc = LANGUAGE_DIRECTIONS[language] || LANGUAGE_DIRECTIONS.moroccan_darija;

    let rateDesc = 'Natural commercial tempo';
    if (rate >= 1.25) rateDesc = 'Rapid, urgent, high-tempo punchy commercial delivery';
    else if (rate >= 1.1) rateDesc = 'Brisk, upbeat commercial pace';
    else if (rate <= 0.85) rateDesc = 'Deliberate, slow, measured, and emphatic cadence';

    let emphasisDesc = 'Distinct rhythmic emphasis on key product benefits and call to action';
    if (emphasis === 'maximum') {
      emphasisDesc = 'Maximum vocal punch, sharp emphasis on offers, discounts, and urgency phrases';
    } else if (emphasis === 'subtle') {
      emphasisDesc = 'Subtle, smooth, understated natural vocal emphasis';
    }

    const speechStyle = `${langDesc}. Tone: ${toneDesc}. Speaking Pace: ${rateDesc}. Emphasis: ${emphasisDesc}.`;

    // Valid prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const allowedVoices = ['Kore', 'Puck', 'Zephyr', 'Fenrir', 'Charon'];
    const selectedVoice = allowedVoices.includes(voice) ? voice : 'Kore';

    console.log(`Generating audio with voice: ${selectedVoice}, tone: ${tone}, lang: ${language}`);

    let audioBase64: string | undefined;

    // Try primary TTS model: gemini-3.8-flash-lite-tts, then fallback to gemini-3.8-flash-tts
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: script.trim(),
                speechMetadata: {
                  style: speechStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (primaryErr) {
      console.warn('Primary TTS model gemini-3.8-flash-lite-tts error, trying gemini-3.8-flash-tts:', primaryErr);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: script.trim(),
                speechMetadata: {
                  style: speechStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      audioBase64 = fallbackResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    }

    if (!audioBase64) {
      return res.status(502).json({
        error: 'Failed to generate audio stream from Gemini TTS engine. Please try a shorter script or adjust parameters.',
      });
    }

    return res.json({
      success: true,
      audioBase64,
      mimeType: 'audio/wav',
      voice: selectedVoice,
      tone,
      language,
      rate,
      emphasis,
    });
  } catch (err: any) {
    console.error('TTS Generation Error:', err);
    return res.status(500).json({
      error: err?.message || 'Internal server error while synthesizing voiceover.',
    });
  }
});

/**
 * Polish & Localize Marketing Script (Moroccan Darija / Arabic)
 */
app.post('/api/voiceover/polish-script', async (req, res) => {
  try {
    const { script, targetLanguage = 'moroccan_darija', tone = 'sales_driven', category = 'ecommerce' } = req.body;

    if (!script || !script.trim()) {
      return res.status(400).json({ error: 'Original script text is required.' });
    }

    const systemPrompt = `You are an elite marketing copywriter and voiceover director specializing in Arabic advertising, particularly Moroccan Darija (الدارجة المغربية) and Modern Standard Arabic (الفصحى).

Your task:
Take the user's raw marketing script or idea and transform it into a high-converting, punchy voiceover script.

CRITICAL INSTRUCTIONS FOR MOROCCAN DARIJA:
- Use authentic, natural Moroccan phrasing (e.g., "دابا", "صافي", "واللهيلا", "شنو كتسنى؟", "السلعة حتى لباب دارك", "التوصيل فابور لجميع المدن", "الدفع عند الاستلام").
- Ensure smooth rhythm, strong hooks in the first 3 seconds, clear product benefit, and an irresistible Call To Action (CTA).
- Include subtle voice direction cues if helpful, like commas for breathing pauses.

CRITICAL INSTRUCTIONS FOR MODERN STANDARD ARABIC:
- Use powerful, persuasive commercial vocabulary with proper diacritics (تَشْكِيل) on key words to guarantee flawless TTS pronunciation.
- Strong emotional or urgency hook.

Respond ONLY with valid JSON with the following structure:
{
  "polishedScript": "The polished voiceover script ready to be spoken",
  "hook": "The opening 3-second hook explanation",
  "cta": "The Call To Action",
  "tips": ["Tip 1 for voice delivery", "Tip 2 for ads conversion"]
}`;

    const promptText = `Original Script / Concept: "${script}"
Target Language/Dialect: ${targetLanguage === 'moroccan_darija' ? 'Moroccan Darija (الدارجة المغربية)' : 'Modern Standard Arabic (الفصحى)'}
Target Tone: ${tone}
Category: ${category}

Optimize this script for a video ad / social media voiceover (TikTok, Instagram Reels, YouTube Shorts, Radio/TV). Return JSON only.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });
    } catch (primaryErr) {
      console.warn('gemini-3.8-flash busy/failed, falling back to gemini-3.1-flash-lite:', primaryErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: promptText,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });
    }

    const jsonText = response.text?.trim() || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch {
      parsedData = {
        polishedScript: jsonText.replace(/^```json|```$/g, '').trim(),
        hook: 'High-impact commercial hook',
        cta: 'Order now',
        tips: ['Use energetic pacing for maximum conversion'],
      };
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: any) {
    console.error('Polish script error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to polish script.',
    });
  }
});

/**
 * Convert WAV audio to MP3 server-side
 */
app.post('/api/voiceover/convert-to-mp3', async (req, res) => {
  try {
    const { audioBase64, kbps = 192 } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required.' });
    }

    const { Mp3Encoder } = await import('@breezystack/lamejs');
    const wavBuffer = Buffer.from(audioBase64, 'base64');

    // Parse WAV
    const channels = wavBuffer.readUInt16LE(22);
    const sampleRate = wavBuffer.readUInt32LE(24);
    const bitsPerSample = wavBuffer.readUInt16LE(34);

    let dataOffset = 44;
    for (let i = 12; i < wavBuffer.length - 8; i++) {
      if (
        wavBuffer[i] === 0x64 &&
        wavBuffer[i + 1] === 0x61 &&
        wavBuffer[i + 2] === 0x74 &&
        wavBuffer[i + 3] === 0x61
      ) {
        dataOffset = i + 8;
        break;
      }
    }

    const encoder = new Mp3Encoder(channels, sampleRate, kbps);
    const sampleCount = Math.floor((wavBuffer.length - dataOffset) / (bitsPerSample / 8));
    const samples = new Int16Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
      const idx = dataOffset + i * 2;
      if (idx + 1 < wavBuffer.length) {
        samples[i] = wavBuffer.readInt16LE(idx);
      }
    }

    const mp3Chunks: Buffer[] = [];
    const blockSize = 1152;

    if (channels === 1) {
      for (let i = 0; i < samples.length; i += blockSize) {
        const chunk = samples.subarray(i, i + blockSize);
        const encoded = encoder.encodeBuffer(chunk);
        if (encoded.length > 0) {
          mp3Chunks.push(Buffer.from(encoded));
        }
      }
    } else {
      const left = new Int16Array(samples.length / 2);
      const right = new Int16Array(samples.length / 2);
      for (let i = 0; i < samples.length; i += 2) {
        left[i / 2] = samples[i];
        right[i / 2] = samples[i + 1];
      }
      for (let i = 0; i < left.length; i += blockSize) {
        const leftChunk = left.subarray(i, i + blockSize);
        const rightChunk = right.subarray(i, i + blockSize);
        const encoded = encoder.encodeBuffer(leftChunk, rightChunk);
        if (encoded.length > 0) {
          mp3Chunks.push(Buffer.from(encoded));
        }
      }
    }

    const flush = encoder.flush();
    if (flush.length > 0) {
      mp3Chunks.push(Buffer.from(flush));
    }

    const finalMp3Buffer = Buffer.concat(mp3Chunks);
    res.setHeader('Content-Type', 'audio/mp3');
    res.setHeader('Content-Disposition', 'attachment; filename="voiceover.mp3"');
    return res.send(finalMp3Buffer);
  } catch (err: any) {
    console.error('Server-side MP3 conversion error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to convert audio to MP3.' });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🎙️ Sawtify Studio Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
