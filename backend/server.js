const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const path = require('path');
const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' })); // Increased limit for complex food photos

// Health check for Northflank/Ping
app.get('/health', (req, res) => res.status(200).send('OK'));

// Serve static files from the React frontend/dist folder
const publicPath = path.resolve(__dirname, '..', 'frontend', 'dist');
app.use(express.static(publicPath));

// Initialize SDK. It automatically picks up GEMINI_API_KEY from environment or process.env.
const ai = new GoogleGenAI({});

const SYSTEM_PROMPT_ANALYZE = `Eres un experto nutricionista. Analiza la imagen de comida adjunta junto con la descripción del usuario.
TU RESPUESTA DEBE SER ESTRICTAMENTE UN JSON VÁLIDO CON LA SIGUIENTE ESTRUCTURA. NO AÑADAS TEXTO FUERA DEL JSON:
{
  "healthLevel": { "index": <numero_del_1_al_7>, "label": "<texto_del_estado>" },
  "macros": {
    "calories": { "level": "<Nivel: ej. Medio>", "value": "<ej. 250 Kcal>" },
    "proteins": { "level": "<Nivel>", "value": "<ej. 110 g>" },
    "fats": { "level": "<Nivel>", "value": "<ej. 20 g>" },
    "carbs": { "level": "<Nivel>", "value": "<ej. 70 g>" }
  },
  "insights": {
    "bestFeature": "<texto sobre el mayor beneficio>",
    "worstFeature": "<texto sobre la mayor advertencia/daño>"
  }
}

ESTADOS DE SALUD PERMITIDOS para 'label' (y su index correspondiente):
1: "Ni una más este mes..."
2: "Una vez al año..."
3: "Hace cosquillas"
4: "Meh, no suma ni resta..."
5: "Buen aporte"
6: "Muy buen recurso"
7: "UGA UGA"
`;

app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, userPrompt } = req.body;

    // Default image extraction
    let cleanBase64 = imageBase64;
    let mimeType = "image/jpeg";

    if (imageBase64.includes('base64,')) {
      const parts = imageBase64.split('base64,');
      mimeType = parts[0].split(':')[1].split(';')[0];
      cleanBase64 = parts[1];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        userPrompt || '¿Qué estoy comiendo y cuáles son sus macros?',
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType
          }
        }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT_ANALYZE,
        responseMimeType: "application/json",
      }
    });

    let rawText = response.text();
    // Strip possible markdown wrapping like ```json ... ```
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    const data = JSON.parse(rawText);
    res.json(data);
  } catch (error) {
    console.error("Error generating analysis details:", error.message, error.stack);
    res.status(500).json({ error: "No se pudo analizar la imagen.", details: error.message });
  }
});

const SYSTEM_PROMPT_CHAT = `Eres Nutri-Croc, un cocodrilo bebé animado especialista en nutrición juvenil.
Tu tono es simple, divertido, empático y hablas como para un público de 12 años, pero con datos reales.
REQUISITO ESTRICTO: Fomenta hábitos sanos SIN restringir comidas. Usa analogías divertidas.
SIEMPRE CITA TUS FUENTES de manera sutil (ej. "Según la OMS..." o "Como dice la Universidad de Harvard...").
Mantén las respuestas concisas, ideales para un chat móvil. Usa emojis como 🐊, 🌟, 🥦.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Build plain prompt history
    let promptHistory = history.map(msg =>
      `${msg.sender === 'user' ? 'Usuario' : 'Nutri-Croc'}: ${msg.text}`
    ).join('\n');

    const fullPrompt = `${SYSTEM_PROMPT_CHAT}\n\nHistorial del Chat:\n${promptHistory}\n\nUsuario: ${message}\nNutri-Croc:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });

    // The response could be slightly malformed if it includes "Nutri-Croc:", strip it
    let reply = response.text().trim();
    if (reply.startsWith('Nutri-Croc:')) {
      reply = reply.replace('Nutri-Croc:', '').trim();
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Nutri-Croc se durmió un momento 🐊💤." });
  }
});

// The "catchall" handler: for any request that doesn't 
// match one above, send back React's index.html file.
app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor listo en puerto ${PORT} (0.0.0.0)`);
});
