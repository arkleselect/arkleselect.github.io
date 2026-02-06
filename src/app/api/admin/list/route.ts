import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentRoot = path.join(process.cwd(), 'content');

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

        if (authHeader !== adminPassword) {
            const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'post';

        if (type === 'post') {
            const postsDir = path.join(contentRoot, 'posts');
            if (!fs.existsSync(postsDir)) await fs.promises.mkdir(postsDir, { recursive: true });

            const files = await fs.promises.readdir(postsDir);
            const posts = await Promise.all(
                files
                    .filter(file => file.endsWith('.md'))
                    .map(async (file) => {
                        const filePath = path.join(postsDir, file);
                        const raw = await fs.promises.readFile(filePath, 'utf8');
                        const { data, content } = matter(raw);
                        return {
                            filename: file,
                            title: data.title || file,
                            date: data.date instanceof Date
                                ? data.date.toISOString().split('T')[0]
                                : String(data.date || '').split('T')[0],
                            description: data.description || '',
                            slug: file.replace('.md', ''),
                            content: content
                        };
                    })
            );

            // Sort by date descending
            posts.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return dateB - dateA;
            });
            const res = NextResponse.json({ items: posts });
            res.headers.set('Cache-Control', 'no-store');
            return res;

        } else if (type === 'daily') {
            const dailyDir = path.join(contentRoot, 'daily');
            if (!fs.existsSync(dailyDir)) await fs.promises.mkdir(dailyDir, { recursive: true });

            const files = await fs.promises.readdir(dailyDir);
            const items = await Promise.all(
                files.filter(file => file.endsWith('.md')).map(async (file) => {
                    const filePath = path.join(dailyDir, file);
                    const raw = await fs.promises.readFile(filePath, 'utf8');
                    const { data, content } = matter(raw);
                    return {
                        filename: file,
                        date: data.date instanceof Date
                            ? data.date.toISOString().split('T')[0]
                            : String(data.date || file.replace('.md', '')).split('T')[0],
                        content: content,
                        imageUrl: data.imageUrl || ''
                    };
                })
            );
            items.sort((a, b) => b.filename.localeCompare(a.filename));
            const res = NextResponse.json({ items });
            res.headers.set('Cache-Control', 'no-store');
            return res;

        } else if (type === 'moment') {
            const momentsDir = path.join(contentRoot, 'moments');
            if (!fs.existsSync(momentsDir)) await fs.promises.mkdir(momentsDir, { recursive: true });

            const files = await fs.promises.readdir(momentsDir);
            const items = await Promise.all(
                files.filter(file => file.endsWith('.md')).map(async (file) => {
                    const filePath = path.join(momentsDir, file);
                    const raw = await fs.promises.readFile(filePath, 'utf8');
                    const { data, content } = matter(raw);
                    return {
                        filename: file,
                        title: data.title || file,
                        date: data.date instanceof Date
                            ? data.date.toISOString().split('T')[0]
                            : String(data.date || '').split('T')[0],
                        imageUrl: data.image || '',
                        content: content
                    };
                })
            );
            items.sort((a, b) => b.filename.localeCompare(a.filename));
            const res = NextResponse.json({ items });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        const res = NextResponse.json({ items: [] });
        res.headers.set('Cache-Control', 'no-store');
        return res;

    } catch (error: any) {
        console.error('List error:', error);
        const res = NextResponse.json({ error: error.message }, { status: 500 });
        res.headers.set('Cache-Control', 'no-store');
        return res;
    }
}
