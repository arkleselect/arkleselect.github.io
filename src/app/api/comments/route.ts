import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    console.log('API: Fetching comments for slug:', slug);

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
            'SELECT nickname, content, contact, created_at, is_admin, parent_id FROM comments WHERE slug = ? ORDER BY created_at ASC'
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
        const tgToken = (env as any).TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
        const tgChatId = (env as any).TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

        const db = (env as any).DB;

        if (!db) {
            return NextResponse.json({ error: 'D1 database not found' }, { status: 500 });
        }

        interface CommentBody {
            slug: string;
            pageTitle?: string;
            nickname: string;
            contact?: string;
            content: string;
            parent_id?: string;
            adminPassword?: string;
        }

        const body = (await req.json()) as CommentBody;
        const { slug, pageTitle, nickname, contact, content, parent_id, adminPassword } = body;

        if (!slug || !nickname || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (content.length > 500) {
            return NextResponse.json({ error: 'Comment too long' }, { status: 400 });
        }

        const isAdmin = adminPassword === (process.env.ADMIN_PASSWORD || 'admin');

        await db.prepare(
            'INSERT INTO comments (slug, nickname, contact, content, parent_id, is_admin) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(slug, nickname, contact || '', content, parent_id || null, isAdmin ? 1 : 0).run();

        // 发送 Telegram 通知
        if (tgToken && tgChatId) {
            try {
                const { sendTelegramNotification } = await import('@/lib/telegram');
                const displayTitle = pageTitle || slug;
                const message = `<b>📬 新评论通知</b>\n\n` +
                    `<b>文章:</b> <code>${displayTitle}</code>\n` +
                    `<b>来自:</b> ${nickname}${isAdmin ? ' (管理员)' : ''}\n` +
                    `<b>联系方式:</b> ${contact || '无'}\n` +
                    `<b>内容:</b>\n${content}\n\n` +
                    `<a href="https://miniload.top/posts/${slug}">点击查看详情</a>`;

                // 使用 await 确保在 Edge Runtime 中发送完成
                await sendTelegramNotification(tgToken, tgChatId, message);
            } catch (err) {
                console.error('Failed to send TG notification:', err);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Post comment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
