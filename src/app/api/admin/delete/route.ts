import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function DELETE(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

        if (authHeader !== adminPassword) {
            const res = NextResponse.json({ error: 'Unauthorized: Invalid security key' }, { status: 401 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        const { type, filename } = await request.json();

        if (!type || !filename) {
            const res = NextResponse.json({ error: 'Missing type or filename' }, { status: 400 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        const contentDir = path.join(process.cwd(), 'content');
        let filePath = '';

        if (type === 'post') {
            filePath = path.join(contentDir, 'posts', filename);
        } else if (type === 'daily') {
            filePath = path.join(contentDir, 'daily', filename);
        } else if (type === 'moment') {
            filePath = path.join(contentDir, 'moments', filename);
        } else {
            const res = NextResponse.json({ error: 'Invalid type' }, { status: 400 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        // Security check: ensure filePath is within contentDir to prevent directory traversal
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(contentDir)) {
            const res = NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            const res = NextResponse.json({ success: true });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        } else {
            const res = NextResponse.json({ error: 'File not found' }, { status: 404 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

    } catch (error: unknown) {
        console.error('Delete error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        const res = NextResponse.json({ error: message }, { status: 500 });
        res.headers.set('Cache-Control', 'no-store');
        return res;
    }
}
