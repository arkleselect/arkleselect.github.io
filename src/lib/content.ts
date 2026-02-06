import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';
import { getRequestContext } from '@cloudflare/next-on-pages';

const contentRoot = path.join(process.cwd(), 'content');

type TocItem = { depth: number; text: string; id: string };
type HeadingNode = { depth?: number };
type ElementNode = { tagName?: string; properties?: Record<string, unknown> };

// 获取 D1 数据库实例
function getDB() {
  if (process.env.NEXT_RUNTIME === 'nodejs') return null;
  try {
    const { env } = getRequestContext();
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return (env as any).DB;
  } catch {
    return null;
  }
}

async function renderMarkdown(markdown: string) {
  const slugger = new GithubSlugger();
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const toc: TocItem[] = [];

  visit(tree, 'heading', (node: unknown) => {
    const heading = node as HeadingNode;
    const depth = typeof heading.depth === 'number' ? heading.depth : 0;
    if (depth < 2 || depth > 3) return;
    const text = toString(node as never).trim();
    if (!text) return;
    const id = slugger.slug(text);
    toc.push({ depth, text, id });
  });

  const html = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => (tree) => {
      visit(tree, 'element', (node: unknown) => {
        const element = node as ElementNode;
        if (element.tagName === 'a' && element.properties?.href) {
          const href = element.properties.href;
          if (typeof href === 'string' && (href.startsWith('http') || href.startsWith('//'))) {
            element.properties.target = '_blank';
            element.properties.rel = 'noopener noreferrer';
          }
        }
      });
    })
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify)
    .process(markdown);

  const htmlString = html.toString();

  return { html: htmlString, toc };
}

function normalizeDate(value?: unknown) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value;
  return '';
}

function safeDate(value?: unknown) {
  const normalized = normalizeDate(value);
  if (!normalized) return 0;
  const ts = Date.parse(normalized);
  return Number.isNaN(ts) ? 0 : ts;
}

export async function getPostSlugs() {
  const db = getDB();
  if (db) {
    const { results } = await db.prepare('SELECT slug FROM posts').all();
    return results.map((r: Record<string, unknown>) => r.slug as string);
  }
  const dir = path.join(contentRoot, 'posts');
  const files = await fs.readdir(dir);
  return files.filter((file) => file.endsWith('.md') && !file.startsWith('.')).map((file) => file.replace(/\.md$/, ''));
}

export async function getAllPosts() {
  const db = getDB();
  if (db) {
    const { results } = await db.prepare('SELECT slug, title, date, description FROM posts ORDER BY date DESC').all();
    return results.map((post: Record<string, unknown>) => ({
      slug: post.slug as string,
      title: post.title as string,
      date: post.date as string,
      description: post.description as string,
      _ts: safeDate(post.date)
    }));
  }

  const dir = path.join(contentRoot, 'posts');
  const files = await fs.readdir(dir);
  const posts = await Promise.all(
    files.filter((file) => file.endsWith('.md')).map(async (file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const description =
        typeof data.description === 'string'
          ? data.description
          : content.replace(/\s+/g, ' ').trim().slice(0, 120);
      const date = normalizeDate(data.date);
      return {
        slug,
        title: typeof data.title === 'string' ? data.title : slug,
        date,
        description,
        _ts: safeDate(date)
      };
    })
  );

  return posts.sort((a, b) => b._ts - a._ts).map((post) => {
    const { _ts, ...rest } = post;
    void _ts;
    return rest;
  });
}

export async function getPostBySlug(slug: string) {
  const db = getDB();
  if (db) {
    const post = await db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first() as Record<string, unknown> | null;
    if (!post) throw new Error('Post not found');
    const { html, toc } = await renderMarkdown(post.content as string);
    return {
      slug: post.slug as string,
      title: post.title as string,
      date: post.date as string,
      description: post.description as string,
      html,
      toc
    };
  }

  const filePath = path.join(contentRoot, 'posts', `${slug}.md`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const { html, toc } = await renderMarkdown(content);

  const date = normalizeDate(data.date);
  return {
    slug,
    title: typeof data.title === 'string' ? data.title : slug,
    date,
    description: typeof data.description === 'string' ? data.description : '',
    html,
    toc
  };
}

export async function getDailyEntries() {
  const db = getDB();
  if (db) {
    const { results } = await db.prepare('SELECT * FROM daily ORDER BY date DESC').all();
    return Promise.all(results.map(async (entry: Record<string, unknown>) => {
      const { html } = await renderMarkdown(entry.content as string);
      return {
        date: entry.date as string,
        title: (entry.title as string) || '',
        image: (entry.image_url as string) || '',
        html
      };
    }));
  }

  const dir = path.join(contentRoot, 'daily');
  const files = await fs.readdir(dir);
  const entries = await Promise.all(
    files.filter((file) => file.endsWith('.md')).map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const { html } = await renderMarkdown(content);
      const date = normalizeDate(data.date) || file.replace(/\.md$/, '');
      return {
        date,
        title: typeof data.title === 'string' ? data.title : '',
        image: typeof data.image === 'string' ? data.image : '',
        html,
        _ts: safeDate(date)
      };
    })
  );

  return entries.sort((a, b) => b._ts - a._ts).map((entry) => {
    const { _ts, ...rest } = entry;
    void _ts;
    return rest;
  });
}

export async function getMomentsEntries() {
  const db = getDB();
  if (db) {
    const { results } = await db.prepare('SELECT * FROM moments ORDER BY date DESC').all();
    return Promise.all(results.map(async (entry: Record<string, unknown>) => {
      const { html } = await renderMarkdown(entry.content as string);
      return {
        date: entry.date as string,
        title: (entry.title as string) || '',
        image: (entry.image_url as string) || '',
        html
      };
    }));
  }

  const dir = path.join(contentRoot, 'moments');
  try {
    await fs.access(dir);
  } catch {
    return [];
  }

  const files = await fs.readdir(dir);
  const entries = await Promise.all(
    files.filter((file) => file.endsWith('.md')).map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const { html } = await renderMarkdown(content);
      const date = normalizeDate(data.date) || file.replace(/\.md$/, '');
      return {
        date,
        title: typeof data.title === 'string' ? data.title : '',
        image: typeof data.image === 'string' ? data.image : '',
        html,
        _ts: safeDate(date)
      };
    })
  );

  return entries.sort((a, b) => b._ts - a._ts).map((entry) => {
    const { _ts, ...rest } = entry;
    void _ts;
    return rest;
  });
}
