"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();

Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinksFromSource = getLinksFromSource;
exports.getContentFromUrl = getContentFromUrl;
const cheerio = __importStar(require("cheerio"));
const aiService_1 = require("./aiService");

async function fetchHtml(url) {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.text();
}

async function getLinksFromSource(source, teamKey, limit = 40
) {
    try {
        const html = await fetchHtml(source.url);
        const relevantLinks = await (0, aiService_1.extractRelevantLinksFromHtml)(html, teamKey);
        const absoluteLinks = relevantLinks
            .map((link) => {
            try {
                return {
                    ...link,
                    url: new URL(link.url, source.url).toString(),
                };
            }
            catch {
                return null;
            }
        })
            .filter((link) => link !== null);
        const uniqueLinks = [];
        const addedUrls = new Set();
        for (const link of absoluteLinks) {
            if (!addedUrls.has(link.url)) {
                uniqueLinks.push(link);
                addedUrls.add(link.url);
            }
        }
        return uniqueLinks.slice(0, limit);
    }
    catch (error) {
        console.error(`Failed to get links from source ${source.name} using AI.`, error);
        return [];
    }
}

async function getContentFromUrl(articleUrl) {
    console.log(`Scraping content from article: ${articleUrl}`);
    const html = await fetchHtml(articleUrl);
    const $ = cheerio.load(html);
    const imageUrl = $('meta[property="og:image"]').attr('content') || null;
    $('script, style, nav, header, footer, aside').remove();
    const title = $('title').text().trim() || $('h1').first().text().trim();
    let mainContentElement = null;
    const commonSelectors = ['article', 'main', '[role="main"]', '.article-body', '.story-content', '#main-content', '#content', '.post-content'];
    for (const selector of commonSelectors) {
        const element = $(selector).first();
        if (element.length > 0 && element.find('p').length > 0) {
            mainContentElement = element;
            break;
        }
    }
    if (!mainContentElement) {
        let maxParagraphs = 0;
        let bestElement = null;
        $('div, section').each((i, el) => {
            const element = $(el);
            const paragraphCount = element.find('p').length;
            if (paragraphCount > maxParagraphs) {
                maxParagraphs = paragraphCount;
                bestElement = element;
            }
        });
        if (bestElement) {
            mainContentElement = bestElement;
        }
    }
    let content = '';
    if (mainContentElement) {
        content = mainContentElement
            .find('p')
            .map((i, el) => $(el).text().trim())
            .get()
            .filter((text) => text.length > 20)
            .join('\n\n');
    }
    if (!content) {
        console.warn(`Could not extract significant content from ${articleUrl}.`);
        return { title, content: '', imageUrl };
    }
    return { title, content, imageUrl };
}
