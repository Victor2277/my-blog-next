import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url || !url.includes('pixnet.net')) {
            return NextResponse.json({ error: 'Invalid Pixnet URL' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch list page');
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const articles = [];

        // Strategy: Look for headers that are links, excluding sidebars
        // Confirmed selector: .title h2 a
        $('.title h2 a').each((i, el) => {
            const link = $(el).attr('href');
            const title = $(el).text().trim();

            if (link) {
                // Ensure unique links
                if (!articles.find(a => a.link === link)) {
                    articles.push({
                        title,
                        link: link.startsWith('http') ? link : `https:${link}` // Handle relative protocol
                    });
                }
            }
        });

        // Fallback: search all links if H2 strategy fails
        if (articles.length === 0) {
            $('.article-title a').each((i, el) => {
                const link = $(el).attr('href');
                const title = $(el).text().trim();
                if (link && !articles.find(a => a.link === link)) {
                    articles.push({
                        title,
                        link: link.startsWith('http') ? link : `https:${link}`
                    });
                }
            });
        }

        return NextResponse.json({ articles });

    } catch (error) {
        console.error('List scraping error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
