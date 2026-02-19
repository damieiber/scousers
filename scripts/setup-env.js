const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setupEnvironment() {
  const envPath = '.env.local';

  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local ya existe. ¿Sobrescribir? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      rl.close();
      return;
    }
  }

  const supabaseUrl = await question('NEXT_PUBLIC_SUPABASE_URL: ');
  const supabaseKey = await question('NEXT_PUBLIC_SUPABASE_ANON_KEY: ');

  const geminiKey = await question('GOOGLE_AI_API_KEY (recomendado): ');
  const openaiKey = await question('OPENAI_API_KEY (fallback): ');

  const cronSecret = await question('CRON_SECRET (string aleatorio): ');

  const finalCronSecret = cronSecret || generateRandomString(32);

  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}

# AI APIs
GOOGLE_AI_API_KEY=${geminiKey}
OPENAI_API_KEY=${openaiKey}

# Cron Jobs Security
CRON_SECRET=${finalCronSecret}
`;

  try {
    fs.writeFileSync(envPath, envContent);

    if (!geminiKey && !openaiKey) {
    } else {
      console.error('\n🎉 IA configurada! Los resúmenes serán generados automáticamente.');
    }
  } catch (error) {
    console.error('❌ Error creando .env.local:', error.message);
  }

  rl.close();
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

setupEnvironment();
