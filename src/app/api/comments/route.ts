import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    try {
        const { env } = getRequestContext();
        const db = (env as any).DB;

        if (!db) {
            return NextResponse.json({ error: 'D1 database not found' }, { status: 500 });
        }

        const { results } = await db.prepare(
            'SELECT nickname, content, created_at FROM comments WHERE slug = ? ORDER BY created_at DESC'
        ).bind(slug).all();

        return NextResponse.json({ comments: results });
    } catch (error: any) {
        console.error('Fetch comments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { env } = getRequestContext();
        const db = (env as any).DB;

        if (!db) {
            return NextResponse.json({ error: 'D1 database not found' }, { status: 500 });
        }

        const body = await req.json();
        const { slug, nickname, content } = body;

        if (!slug || !nickname || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 简单的内容长度限制
        if (content.length > 500) {
            return NextResponse.json({ error: 'Comment too long' }, { status: 400 });
        }

        await db.prepare(
            'INSERT INTO comments (slug, nickname, content) VALUES (?, ?, ?)'
        ).bind(slug, nickname, content).run();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Post comment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
