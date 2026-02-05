
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({
    customFields: {
        item: ['content:encoded']
    }
});

// Daftar RSS Feed
const FEEDS = [
    { name: "Muslim.or.id", url: "https://muslim.or.id/feed", color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Rumaysho", url: "https://rumaysho.com/feed", color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Almanhaj", url: "https://almanhaj.or.id/feed", color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Konsultasi Syariah", url: "https://konsultasisyariah.com/feed", color: "text-purple-600", bg: "bg-purple-50" }
];

interface Article {
    id?: string;
    title: string;
    link: string;
    pubDate: string;
    isoDate: string;
    source: string;
    contentSnippet: string;
    content?: string;
    color: string;
    bg: string;
}

export async function GET() {
    try {
        const feedPromises = FEEDS.map(async (feed) => {
            try {
                const data = await parser.parseURL(feed.url);
                return data.items.map(item => {
                    const link = item.link || "#";
                    // Create a simple base64 ID from the link to ensure it's deterministic and URL-safe
                    const id = Buffer.from(link).toString('base64').replace(/=/g, '').replace(/\//g, '_').replace(/\+/g, '-');

                    return {
                        id,
                        title: item.title || "Tanpa Judul",
                        link,
                        pubDate: item.pubDate || "",
                        isoDate: item.isoDate || new Date().toISOString(),
                        source: feed.name,
                        contentSnippet: item.contentSnippet || item.content || "",
                        content: item['content:encoded'] || item.content || item.contentSnippet || "",
                        color: feed.color,
                        bg: feed.bg
                    };
                });
            } catch (error) {
                console.error(`Error fetching feed from ${feed.name}:`, error);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        let allArticles: Article[] = results.flat();

        // Sort by date (newest first)
        allArticles.sort((a, b) => {
            return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
        });

        // Limit to 50 latest articles and add ID
        const articlesWithId = allArticles.slice(0, 50).map(article => ({
            ...article,
            id: Buffer.from(article.link).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        }));

        return NextResponse.json({
            success: true,
            articles: articlesWithId
        });

    } catch (error) {
        console.error("Error aggregating feeds:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch articles" }, { status: 500 });
    }
}
