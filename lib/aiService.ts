import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { sanitizeHtml } from './sanitize';

export interface ArticleData {
  url: string;
  title: string;
  sourceName: string;
  teamId: string;
  imageUrl?: string | null;
  content?: string;
}

export interface ThemedArticleGroup {
  theme: string;
  articles: ArticleData[];
  imageUrl?: string | null;
}

const API_KEY = process.env.GOOGLE_AI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn('Google AI API key not found. AI functionality will be disabled.');
}

// Rate limiting configuration
const RETRY_DELAY = 10000;
const RATE_LIMIT_DELAY = 10000; // 10 seconds between requests to strictly stay under rate limits
const MAX_RETRIES = 5;

// Simple delay helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generationConfig = {
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error && typeof (error as { status: unknown }).status === 'number';
}

async function generateContentWithGemini(prompt: string, json: boolean = false): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini AI not available. Check API_KEY.');
  }

  // Rate Limiting: Wait before making a request
  console.log(`[AI] Generating content with model: gemini-2.5-flash...`);
  await sleep(RATE_LIMIT_DELAY);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash', // Updated to 2.5 flash as per 2026 availability
    generationConfig: {
      ...generationConfig,
      responseMimeType: json ? 'application/json' : 'text/plain',
    },
    safetySettings,
  });

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: unknown) {
      lastError = error;
      console.error('Detailed error:', error);
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Retry on 503 (Unavailable) or 429 (Too Many Requests)
      if ((hasStatus(error) && (error.status === 503 || error.status === 429 || error.status === 500)) || (error instanceof TypeError && errorMessage.includes('fetch failed'))) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.warn(`Attempt ${attempt} failed with error: ${errorMessage}. Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }

  console.error('All retries failed.');
  throw lastError;
}


// ... (keeping interfaces and clusters function same, just ensuring they use generateContentWithGemini which now has rate limit)
export async function clusterArticlesByTheme(articles: ArticleData[]): Promise<ThemedArticleGroup[]> {
  if (!genAI) {
    console.warn('AI disabled. Returning empty array for clustering.');
    return [];
  }

  const articlesInput = articles.map((a) => ({ url: a.url, title: a.title }));

  const prompt = `
    Task: Group the provided news articles by a highly specific, shared theme.

    Rules:
    1.  **Strict Grouping:** Only group articles that cover the exact same event, protagonist, or central news story. (e.g., multiple reports on a specific player's injury).
    2.  **No Broad Themes:** Do not group articles on loosely related topics (e.g., a transfer rumor and a player injury are different themes).
    3.  **Ignore Generic Pages:** Do not group articles with generic titles like "Últimas noticias", "Home", or similar non-descriptive titles. These are likely section fronts, not actual articles.
    4.  **Minimum Group Size:** A group must contain at least TWO articles. Do not create groups for single articles.
    5.  **Ignore Unrelated:** If an article does not share a specific theme with at least one other, IGNORE IT. Do not create a theme for it.
    6.  **Theme Title:** Create a short, descriptive theme title in Spanish for each group.

    Output Format:
    Return a valid JSON array of objects. Each object must have two keys:
    1. "theme": The Spanish theme title.
    2. "urls": An array of URL strings for that theme.

    Articles to Process:
    ${JSON.stringify(articlesInput)}

    JSON Output:
  `;

  try {
    const rawJson = await generateContentWithGemini(prompt, true);
    const clusters: { theme: string; urls: string[] }[] = JSON.parse(rawJson);

    const themedGroups: ThemedArticleGroup[] = clusters.map((cluster) => ({
      theme: cluster.theme,
      articles: cluster.urls.map((url) => articles.find((a) => a.url === url)).filter((a): a is ArticleData => !!a),
    }));

    themedGroups.forEach((group) => {
      let selectedImageUrl: string | null = null;
      let fallbackImageUrl: string | null = null;

      const firstArticleWithValidImage = group.articles.find((article) => {
        if (!article.imageUrl) return false;
        const lowercasedUrl = article.imageUrl.toLowerCase();
        return !lowercasedUrl.includes('logo') && !lowercasedUrl.includes('favicon') && !lowercasedUrl.includes('icon') && !lowercasedUrl.includes('placeholder') && !lowercasedUrl.includes('default');
      });

      if (firstArticleWithValidImage) {
        selectedImageUrl = firstArticleWithValidImage.imageUrl || null;
      } else {
        const firstArticleWithAnyImage = group.articles.find((article) => article.imageUrl);
        if (firstArticleWithAnyImage) {
          fallbackImageUrl = firstArticleWithAnyImage.imageUrl || null;
        }
      }

      group.imageUrl = selectedImageUrl || fallbackImageUrl;
    });

    return themedGroups;
  } catch (error) {
    console.error('Error clustering articles by theme:', error);
    return [];
  }
}

export async function extractRelevantLinksFromHtml(htmlContent: string, teamName: string): Promise<{ url: string; title: string }[]> {
  if (!genAI) {
    console.warn('AI disabled. Cannot extract links from HTML.');
    return [];
  }

  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const focusedHtml = bodyMatch ? bodyMatch[1] : htmlContent;
  const cleanHtml = focusedHtml
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/\s\s+/g, ' ')
    .substring(0, 50000);

  const prompt = `
    Actúa como un experto en web scraping. Tu tarea es analizar el siguiente contenido HTML y extraer todos los enlaces que apunten a noticias relevantes sobre el equipo "${teamName}".

    Reglas de Relevancia:
    1.  **Prioriza la Relevancia:** El objetivo principal es encontrar noticias sobre "${teamName}". Un enlace es relevante si el texto del enlace (el anchor text) o el título del enlace (el atributo 'title') menciona directamente al equipo o a sus jugadores clave.
    2.  **Contexto Ampliado:** Si el texto del enlace no es suficiente, considera el texto circundante (párrafos o encabezados cercanos) para determinar la relevancia.
    3.  **Busca en Estructuras de Noticias:** Presta especial atención a los enlaces que se encuentren dentro de etiquetas como \<article\>, \<section\>, \<div\> con clases como "news", "story", "post" o "item".
    4.  **Excluye lo Irrelevante:** Ignora enlaces de navegación principal, menús, pies de página, redes sociales, secciones genéricas ("Deportes", "Videos") o publicidad. No extraigas enlaces a la misma página (href="#") o a páginas de login.
    5.  **URLs Absolutas:** Asegúrate de que las URLs sean absolutas. Si encuentras una URL relativa (ej. /noticia/123), conviértela en absoluta.

    HTML a analizar:
    \<\>html
    ${cleanHtml}
    \<\>

    Formato de Salida:
    Devuelve un objeto JSON válido con una única clave "links". El valor de "links" debe ser un array de objetos, donde cada objeto tiene "url" y "title".


    JSON Output:
  `;

  try {
    const rawJson = await generateContentWithGemini(prompt, true);
    const { links }: { links: { url: string; title: string }[] } = JSON.parse(rawJson);
    return links || [];
  } catch (error) {
    console.error('Error extracting relevant links from HTML:', error);
    return [];
  }
}

export async function filterRelevantArticles(articles: ArticleData[], teamName: string, teamKeywords: string[]): Promise<ArticleData[]> {
  if (!genAI) {
    console.warn('AI disabled. Assuming all articles are relevant.');
    return articles;
  }

  if (articles.length === 0) {
    return [];
  }

  const articlesInput = articles.map((a) => ({ url: a.url, title: a.title, content: a.content?.substring(0, 1000) }));

  const prompt = `
    Task: Identify which of the following articles are relevant to the team "${teamName}".

    An article is relevant if its content contains significant information about the team "${teamName}" and is exclusively about FOOTBALL (fútbol), its players, matches, or official news.
    **Exclude articles primarily about other sports (e.g., volleyball, basketball, tennis, etc.) even if they mention "${teamName}".**
    General sports news, betting odds, or articles where the team is only mentioned in passing are NOT relevant.

    Evaluate the relevance based on the provided 'content' for each article.

    Team Keywords: ${teamKeywords.join(', ')}

    Articles to evaluate:
    ${JSON.stringify(articlesInput)}

    Output Format:
    Return a valid JSON object with a single key "relevantUrls", which is an array of URL strings for the articles that are relevant.

    JSON Output:
  `;

  try {
    const rawJson = await generateContentWithGemini(prompt, true);
    const { relevantUrls }: { relevantUrls: string[] } = JSON.parse(rawJson);

    const relevantArticles = articles.filter((a) => relevantUrls.includes(a.url));

    return relevantArticles;
  } catch (error) {
    console.error('Error filtering articles for relevance:', error);
    return [];
  }
}

export async function summarizeThemedArticles(theme: string, articles: ArticleData[]): Promise<{ shortSummary: string; fullSummary: string }> {
  if (!genAI) {
    console.warn('AI disabled. Returning placeholder summary.');
    return {
      shortSummary: `Este es un resumen corto para el tema "${theme}".`,
      fullSummary: `Este es un resumen de marcador de posición para el tema "${theme}".`,
    };
  }

  const articlesInput = articles.map((a) => ({ source: a.sourceName, title: a.title }));

  const prompt = `
    Actúa como un periodista deportivo experto. A continuación, se te proporcionan varios artículos de diferentes fuentes, todos sobre el mismo tema: "${theme}".

    Tu tarea es leer y sintetizar la información de TODOS los artículos para crear dos resúmenes en castellano y devolverlos en formato JSON.

    1.  **fullSummary**: Un resumen consolidado, coherente y bien redactado. Debe ser objetivo, escrito en un **único párrafo de entre 3 y 5 frases**, y combinar la información de todas las fuentes sin inventar datos.
    2.  **shortSummary**: Un resumen de vista previa, extremadamente corto y directo. Debe ser **una única oración de no más de 15 palabras**. Por ejemplo: "El jugador estrella se lesionó y no jugará el próximo partido."

    El formato de salida debe ser un objeto JSON con las claves "fullSummary" y "shortSummary".

    Aquí están los artículos para sintetizar:
    ${JSON.stringify(articlesInput)}

    JSON Output:
  `;

  try {
    const rawJson = await generateContentWithGemini(prompt, true);
    const summaries = JSON.parse(rawJson);

    let fullSummary = summaries.fullSummary;
    let shortSummary = summaries.shortSummary;

    if (typeof fullSummary !== 'string') {
      console.error('AI returned non-string fullSummary. Using placeholder.', fullSummary);
      fullSummary = `No se pudo generar el resumen completo para el tema "${theme}".`;
    }
    if (typeof shortSummary !== 'string') {
      console.error('AI returned non-string shortSummary. Using placeholder.', shortSummary);
      shortSummary = `No se pudo generar el resumen corto para el tema "${theme}".`;
    }

    fullSummary = sanitizeHtml(fullSummary || '');
    shortSummary = sanitizeHtml(shortSummary || '');

    return { fullSummary, shortSummary };
  } catch (error) {
    console.error(`Error generating summary for theme "${theme}":`, error);
    return {
      shortSummary: `No se pudo generar el resumen corto para el tema "${theme}".`,
      fullSummary: `No se pudo generar el resumen para el tema "${theme}" debido a un error.`,
    };
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!genAI) {
    throw new Error('Gemini AI not available. Check API_KEY.');
  }

  // Rate Limiting
  await sleep(RATE_LIMIT_DELAY);

  // Fallback to gemini-embedding-001 as text-embedding-004 is missing
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error: unknown) {
      lastError = error;
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.error(`Embedding error detailed:`, error);
      
      // Retry on 503, 429, or 404 (in case of transient model issues, though 404 usually fatal)
      if ((hasStatus(error) && (error.status === 503 || error.status === 429 || error.status === 500))) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.warn(`Embedding attempt ${attempt} failed with error: ${errorMessage}. Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }

  console.error('All embedding retries failed.');
  throw lastError;
}

export type RivalSentiment = 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';

export async function classifyRivalSentiment(
  articleTitle: string,
  articleSummary: string,
  rivalTeamName: string
): Promise<RivalSentiment> {
  if (!genAI) {
    console.warn('AI disabled. Returning NEUTRAL as default.');
    return 'NEUTRAL';
  }

  const prompt = `
    Eres un analista de noticias deportivas. Tu tarea es clasificar el sentimiento de una noticia desde la perspectiva de un hincha RIVAL del equipo mencionado.

    Equipo de la noticia: "${rivalTeamName}"
    
    Título: "${articleTitle}"
    Resumen: "${articleSummary}"

    Clasifica la noticia según cómo la percibiría un hincha rival:
    
    - NEGATIVE: Noticia MALA para ${rivalTeamName} (derrotas, lesiones graves, crisis institucional, sanciones, fracasos). Esto es lo que un rival querría ver.
    - NEUTRAL: Noticia objetiva sin impacto emocional claro (fichajes menores, entrenamientos, declaraciones neutrales).
    - POSITIVE: Noticia BUENA para ${rivalTeamName} (victorias, clasificaciones, fichajes importantes, logros). Esto es lo que un rival NO querría ver.

    IMPORTANTE: Responde ÚNICAMENTE con una de estas tres palabras exactas: NEGATIVE, NEUTRAL, o POSITIVE
    
    Clasificación:
  `;

  try {
    const response = await generateContentWithGemini(prompt, false);
    const sentiment = response.trim().toUpperCase();
    
    if (sentiment === 'NEGATIVE' || sentiment === 'NEUTRAL' || sentiment === 'POSITIVE') {
      return sentiment as RivalSentiment;
    }
    
    return 'NEUTRAL';
  } catch (error) {
    console.error('Error classifying rival sentiment:', error);
    return 'NEUTRAL';
  }
}
