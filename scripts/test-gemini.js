require('dotenv').config({ path: '.env.local' });

async function testGeminiAPI() {

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  const embeddingsKey = process.env.GOOGLE_AI_API_KEY_EMBEDDINGS;

  if (!apiKey) {
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Genera un resumen de 2 oraciones sobre River Plate en español.',
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 100,
        },
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        const summary = data.candidates[0].content.parts[0].text;
      } else {
      }
    } else {
      const errorData = await response.text();
    }
  } catch (error) {
    console.error(`❌ Text generation error: ${error.message}\n`);
  }

  if (embeddingsKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${embeddingsKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {
            parts: [
              {
                text: 'River Plate ganó la Copa Libertadores',
              },
            ],
          },
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.embedding && data.embedding.values) {
        } else {
          console.error('⚠️  Embeddings response empty\n');
        }
      } else {
        const errorData = await response.text();
        console.error(`❌ Embeddings failed: ${response.status} - ${errorData}\n`);
      }
    } catch (error) {
      console.error(`❌ Embeddings error: ${error.message}\n`);
    }
  } else {
    console.error('⚠️  Embeddings API key not configured\n');
  }
}

testGeminiAPI().catch(console.error);