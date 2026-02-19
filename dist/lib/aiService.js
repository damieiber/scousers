"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clusterArticlesByTheme = clusterArticlesByTheme;
exports.extractRelevantLinksFromHtml = extractRelevantLinksFromHtml;
exports.filterRelevantArticles = filterRelevantArticles;
exports.summarizeThemedArticles = summarizeThemedArticles;
exports.generateEmbedding = generateEmbedding;
const generative_ai_1 = require("@google/generative-ai");
const sanitize_1 = require("./sanitize");
const API_KEY = process.env.GOOGLE_AI_API_KEY;
let genAI = null;
if (API_KEY) {
    genAI = new generative_ai_1.GoogleGenerativeAI(API_KEY);
}
else {
    console.warn('Google AI API key not found. AI functionality will be disabled.');
}
const generationConfig = {
// temperature: 0.7, // A bit more creative for summarization
// topK: 1,
// topP: 1,
// maxOutputTokens: 4096,
};
const safetySettings = [
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH },
];
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
function hasStatus(error) {
    return typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number';
}

async function generateContentWithGemini(prompt, json = false) {
    if (!genAI) {
        throw new Error('Gemini AI not available. Check API_KEY.');
    }
    const model = genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        generationConfig: {
            ...generationConfig,
            responseMimeType: json ? 'application/json' : 'text/plain',
        },
        safetySettings,
    });
    let lastError = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        }
        catch (error) {
            lastError = error;
            console.error('Detailed error:', error);
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            if ((hasStatus(error) && error.status === 503) || (error instanceof TypeError && errorMessage.includes('fetch failed'))) {
                console.warn(`Attempt ${attempt} failed with error: ${errorMessage}. Retrying in ${RETRY_DELAY / 1000}s...`);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            }
            else {
                throw error;
            }
        }
    }
    console.error('All retries failed.');
    throw lastError;
}

async function clusterArticlesByTheme(articles) {
    if (!genAI) {
        console.warn('AI disabled. Returning empty array for clustering.');
        return [];
    }
    const articlesInput = articles.map((a) => ({ url: a.url, title: a.title, content: a.content.substring(0, 2000) }));
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
        const clusters = JSON.parse(rawJson);
        const themedGroups = clusters.map((cluster) => ({
            theme: cluster.theme,
            articles: cluster.urls.map((url) => articles.find((a) => a.url === url)).filter((a) => !!a),
        }));
        themedGroups.forEach((group) => {
            let selectedImageUrl = null;
            let fallbackImageUrl = null;
            const firstArticleWithValidImage = group.articles.find((article) => {
                if (!article.imageUrl)
                    return false;
                const lowercasedUrl = article.imageUrl.toLowerCase();
                return !lowercasedUrl.includes('logo') && !lowercasedUrl.includes('favicon') && !lowercasedUrl.includes('icon') && !lowercasedUrl.includes('placeholder') && !lowercasedUrl.includes('default');
            });
            if (firstArticleWithValidImage) {
                selectedImageUrl = firstArticleWithValidImage.imageUrl || null;
            }
            else {
                const firstArticleWithAnyImage = group.articles.find((article) => article.imageUrl);
                if (firstArticleWithAnyImage) {
                    fallbackImageUrl = firstArticleWithAnyImage.imageUrl || null;
                }
            }
            group.imageUrl = selectedImageUrl || fallbackImageUrl;
        });
        return themedGroups;
    }
    catch (error) {
        console.error('Error clustering articles by theme:', error);
        return [];
    }
}

async function extractRelevantLinksFromHtml(htmlContent, teamName) {
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
    Ejemplo: { "links": [{ "url": "https://example.com/noticia-1", "title": "El gran partido de..." }] }

    JSON Output:
  `;
    try {
        const rawJson = await generateContentWithGemini(prompt, true);
        const startIndex = rawJson.indexOf('{');
        const endIndex = rawJson.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) {
            console.error('No valid JSON object found in AI response:', rawJson);
            return [];
        }
        const jsonString = rawJson.substring(startIndex, endIndex + 1);
        const { links } = JSON.parse(jsonString);
        return links || [];
    }
    catch (error) {
        console.error('Error extracting relevant links from HTML:', error);
        return [];
    }
}

async function filterRelevantArticles(articles, teamName, teamKeywords) {
    if (!genAI) {
        console.warn('AI disabled. Assuming all articles are relevant.');
        return articles;
    }
    if (articles.length === 0) {
        return [];
    }
    const articlesInput = articles.map((a) => ({ url: a.url, title: a.title, content: a.content.substring(0, 1000) }));
    const prompt = `
    Task: Identify which of the following articles are relevant to the team "${teamName}".

    An article is relevant if its content is primarily about the team "${teamName}", its players, matches, or official news.
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
        const { relevantUrls } = JSON.parse(rawJson);
        const relevantArticles = articles.filter((a) => relevantUrls.includes(a.url));
        return relevantArticles;
    }
    catch (error) {
        console.error('Error filtering articles for relevance:', error);
        return [];
    }
}

async function summarizeThemedArticles(theme, articles) {
    if (!genAI) {
        console.warn('AI disabled. Returning placeholder summary.');
        return {
            shortSummary: `Este es un resumen corto para el tema "${theme}".`,
            fullSummary: `Este es un resumen de marcador de posición para el tema "${theme}".`,
        };
    }
    const articlesInput = articles.map((a) => ({ source: a.sourceName, title: a.title, content: a.content }));
    const prompt = `
    Actúa como un periodista deportivo experto. A continuación, se te proporcionan varios artículos de diferentes fuentes, todos sobre el mismo tema: "${theme}".

    Tu tarea es leer y sintetizar la información de TODOS los artículos para crear dos resúmenes en castellano y devolverlos en formato JSON.

    1.  **fullSummary**: Un resumen consolidado, coherente y bien redactado. Debe ser objetivo, tener de 1 a 3 párrafos y combinar la información de todas las fuentes sin inventar datos.
    2.  **shortSummary**: Un resumen de vista previa, mucho más corto. Debe consistir en una "bajada" (una frase introductoria potente) y un máximo de 1 párrafo.

    El formato de salida debe ser un objeto JSON con las claves "fullSummary" y "shortSummary".

    Aquí están los artículos para sintetizar:
    ${JSON.stringify(articlesInput)}

    JSON Output:
  `;
    try {
        const rawJson = await generateContentWithGemini(prompt, true);
        const startIndex = rawJson.indexOf('{');
        const endIndex = rawJson.lastIndexOf('}');
        const jsonString = rawJson.substring(startIndex, endIndex + 1);
        const summaries = JSON.parse(jsonString);
        summaries.fullSummary = (0, sanitize_1.sanitizeHtml)(summaries.fullSummary || '');
        summaries.shortSummary = (0, sanitize_1.sanitizeHtml)(summaries.shortSummary || '');
        return summaries;
    }
    catch (error) {
        console.error(`Error generating summary for theme "${theme}":`, error);
        return {
            shortSummary: `No se pudo generar el resumen corto para el tema "${theme}".`,
            fullSummary: `No se pudo generar el resumen para el tema "${theme}" debido a un error.`,
        };
    }
}

async function generateEmbedding(text) {
    if (!genAI) {
        throw new Error('Gemini AI not available. Check API_KEY.');
    }
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    let lastError = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const result = await model.embedContent(text);
            return result.embedding.values;
        }
        catch (error) {
            lastError = error;
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            if ((hasStatus(error) && error.status === 503) || (error instanceof TypeError && errorMessage.includes('fetch failed'))) {
                console.warn(`Embedding attempt ${attempt} failed with error: ${errorMessage}. Retrying in ${RETRY_DELAY / 1000}s...`);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            }
            else {
                throw error;
            }
        }
    }
    console.error('All embedding retries failed.');
    throw lastError;
}
