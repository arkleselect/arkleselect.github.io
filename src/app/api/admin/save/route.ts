import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request: Request) {
    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        return NextResponse.json(
            { error: 'Management API is only available in local development environment.' },
            { status: 501 }
        );
    }

    const fs = eval('require')('fs');
    const path = eval('require')('path');
    const matter = eval('require')('gray-matter');

    try {
        const authHeader = request.headers.get('Authorization');
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

        if (authHeader !== adminPassword) {
            const res = NextResponse.json({ error: 'Unauthorized: Invalid security key' }, { status: 401 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        const { type, data } = await request.json();

        if (!type || !data) {
            const res = NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        const contentDir = path.join(process.cwd(), 'content');
        let filePath = '';
        let fileContent = '';

        if (type === 'post') {
            const { title, date, description, content, slug, filename } = data;

            if (filename) {
                // Editing mode
                filePath = path.join(contentDir, 'posts', filename);
            } else {
                // New post mode
                const baseFileName = slug || date.replace(/-/g, '');
                let fileName = `${baseFileName}.md`;
                filePath = path.join(contentDir, 'posts', fileName);

                let counter = 1;
                while (fs.existsSync(filePath)) {
                    fileName = `${baseFileName}_${counter}.md`;
                    filePath = path.join(contentDir, 'posts', fileName);
                    counter++;
                }
            }

            fileContent = matter.stringify(content, {
                title,
                date,
                description,
            });
        } else if (type === 'daily') {
            const { date, content, imageUrl } = data;
            const fileName = `${date.replace(/-/g, '').slice(2)}.md`;
            filePath = path.join(contentDir, 'daily', fileName);

            let newContent = `\n\n${content}\n`;
            if (imageUrl && imageUrl.trim() !== '') {
                newContent += `\n![Daily Image](${imageUrl})\n`;
            }

            if (fs.existsSync(filePath)) {
                const existing = fs.readFileSync(filePath, 'utf8');
                fileContent = existing + `\n---\n${newContent}`;
            } else {
                fileContent = newContent;
            }
        } else if (type === 'moment') {
            const { title, date, imageUrl, content } = data;
            const timestamp = new Date().getTime();
            const fileName = `moment_${timestamp}.md`;
            filePath = path.join(contentDir, 'moments', fileName);

            fileContent = matter.stringify(content || '', {
                title: title || `Moment_${timestamp}`,
                date,
                image: imageUrl,
            });
        } else {
            const res = NextResponse.json({ error: 'Invalid type' }, { status: 400 });
            res.headers.set('Cache-Control', 'no-store');
            return res;
        }

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, fileContent, 'utf8');

        const res = NextResponse.json({ success: true, filePath });
        res.headers.set('Cache-Control', 'no-store');
        return res;
    } catch (error: unknown) {
        console.error('Save error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        const res = NextResponse.json({ error: message }, { status: 500 });
        res.headers.set('Cache-Control', 'no-store');
        return res;
    }
}
