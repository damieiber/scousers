const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
  console.error('GOOGLE_AI_API_KEY not found in environment variables.');
  process.exit(1);
}

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    const fs = require('fs');
    if (data.models) {
        fs.writeFileSync('available_models.json', JSON.stringify(data, null, 2));
        console.log('Models wrote to available_models.json');
    } else {
        console.log('No models found in response.');
        console.log('Raw Data:', JSON.stringify(data, null, 2));
    }

  } catch (error: any) {
    console.error('Error fetching models:', error.message);
  }
}

listModels();
