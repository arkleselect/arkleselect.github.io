import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const contentRoot = path.join(process.cwd(), 'content');

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

        if (authHeader !== adminPassword) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const postsDir = path.join(contentRoot, 'posts');
        const files = await fs.readdir(postsDir);

        const posts = await Promise.all(
            files
                .filter(file => file.endsWith('.md'))
                .map(async (file) => {
                    const filePath = path.join(postsDir, file);
                    const raw = await fs.readFile(filePath, 'utf8');
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

        return NextResponse.json({ posts });
    } catch (error: unknown) {
        console.error('List posts error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
