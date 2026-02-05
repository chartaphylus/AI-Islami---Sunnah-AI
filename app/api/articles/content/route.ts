
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
        }

        // Fetch the article HTML
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch URL: ${res.status}`);
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        // Remove script, style, and iframe elements
        $('script').remove();
        $('style').remove();
        $('iframe').remove();
        $('nav').remove();
        $('header').remove();
        $('footer').remove();
        $('.sidebar').remove();
        $('.comments').remove();
        $('.related-posts').remove();
        $('.ads').remove(); // Generic ad class

        // Target common main content areas
        // Muslim.or.id: .post-content, Rumaysho: .entry-content, Almanhaj: .entry-content
        let content = $('.entry-content p, .post-content p, .article-content p, main p').slice(0, 6).map((i, el) => $(el).text()).get().join('\n\n');

        if (!content || content.length < 100) {
            // Fallback if specific selectors fail, just grab first few paragraphs of body
            content = $('body p').slice(0, 6).map((i, el) => $(el).text()).get().join('\n\n');
        }

        return NextResponse.json({
            success: true,
            content: content
        });

    } catch (error: any) {
        console.error("Error scraping article:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
