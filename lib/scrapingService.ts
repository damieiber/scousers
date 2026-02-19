import * as cheerio from 'cheerio';
import { extractRelevantLinksFromHtml } from './aiService';
import { Source } from './types';

async function fetchHtml(url: string): Promise<string> {
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

export async function getLinksFromSource(
  source: Source,
  teamKey: string,
  limit: number = 40
): Promise<{ url: string; title: string }[]> {
  try {
    const html = await fetchHtml(source.url);

    const relevantLinks = await extractRelevantLinksFromHtml(html, teamKey);

    const absoluteLinks = relevantLinks
      .map((link) => {
        try {
          return {
            ...link,
            url: new URL(link.url, source.url).toString(),
          };
        } catch {
          return null;
        }
      })
      .filter((link): link is { url: string; title: string } => link !== null);
    const uniqueLinks: { url: string; title: string }[] = [];
    const addedUrls = new Set<string>();
    for (const link of absoluteLinks) {
      if (!addedUrls.has(link.url)) {
        uniqueLinks.push(link);
        addedUrls.add(link.url);
      }
    }

    return uniqueLinks.slice(0, limit);
  } catch (error) {
    console.error(`Failed to get links from source ${source.name} using AI.`, error);
    return [];
  }
}

export async function getContentFromUrl(articleUrl: string): Promise<{ title: string; content: string; imageUrl: string | null }> {

  const html = await fetchHtml(articleUrl);
  const $ = cheerio.load(html);

  const imageUrl = $('meta[property="og:image"]').attr('content') || null;

  $('script, style, nav, header, footer, aside').remove();

  const title = $('title').text().trim() || $('h1').first().text().trim();

  const content = $('body').text().trim();

  return { title, content, imageUrl };
}
