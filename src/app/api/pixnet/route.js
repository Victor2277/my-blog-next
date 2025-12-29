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
            throw new Error('Failed to fetch article');
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Selectors for Pixnet (Common patterns)
        // Title usually in .title h2 or .article-title
        let title = $('.title h2 a').text().trim() || $('.article-title').text().trim() || $('h2.title').text().trim();

        // Content usually in .article-content or .article-body
        let content = $('.article-content').html() || $('.article-body').html() || $('#article-content').html();

        // Date
        // Pixnet often splits date into .year, .month, .date
        let dateStr = '';
        const year = $('.year').text().trim();
        const month = $('.month').text().trim();
        const day = $('.date').text().trim(); // This might be just the day number

        if (year && month && day) {
            dateStr = `${month} ${day} ${year}`;
        } else {
            // Fallback to other selectors
            dateStr = $('.publish-date').text().trim() || $('.article-date').text().trim() || $('.time').text().trim();
        }

        let date = new Date().toISOString();
        if (dateStr) {
            const parsedDate = new Date(dateStr);
            // Check if valid date
            if (!isNaN(parsedDate.getTime())) {
                date = parsedDate.toISOString();
            }
        }

        // Cover Image (Try to find the first image in content)
        let coverImage = '';
        if (content) {
            const $content = cheerio.load(content);
            const firstImg = $content('img').first();
            if (firstImg.length) {
                coverImage = firstImg.attr('src');
            }
        }

        if (!content) {
            throw new Error('Could not find article content');
        }

        // Clean up content slightly (optional)
        // Remove scripts, iframes if needed, or keeping them for embedded videos
        // For now, raw HTML is okay as we trust the source (mostly)

        return NextResponse.json({
            title,
            content,
            date,
            coverImage,
            category: '未分類' // Pixnet categories are hard to map 1:1 without digging
        });

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
