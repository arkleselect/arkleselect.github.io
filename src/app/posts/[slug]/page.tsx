import { getPostBySlug, getPostSlugs } from "@/lib/content";
import MarkdownContent from "@/components/markdown-content";
import Comments from "@/components/comments";

export const dynamicParams = true;
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// 移除 generateStaticParams，因为它与 runtime = 'edge' + force-dynamic 冲突
// export async function generateStaticParams() {
//   const slugs = await getPostSlugs();
//   return slugs.map((slug: string) => ({ slug }));
// }

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: Awaited<ReturnType<typeof getPostBySlug>> | null = null;

  try {
    post = await getPostBySlug(slug);
  } catch {
    post = null;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">文章未找到</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-24 pb-32 px-6">
      <div className="bg-transparent">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-[10px] font-mono text-white/20 mb-4 uppercase tracking-[0.3em]">
            <span>POST / {post.category || 'SECURITY'}</span>
            <span className="h-[1px] w-8 bg-white/10"></span>
            <span>{post.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-white/30 font-mono italic">
            <span className="opacity-50">AUTHOR: </span>
            <span className="text-white/60 underline decoration-white/10 underline-offset-4">MortySmith</span>
          </div>
        </header>

        <div className="mt-12 border-t border-white/5 pt-12">

          <div className="relative">
            <MarkdownContent
              html={post.html}
              className="prose prose-invert max-w-none text-sm leading-[1.8]"
            />

            {post.toc.length > 0 ? (
              <div className="toc-rail hidden md:flex">
                <div className="toc-ticks">
                  {post.toc.map((item, index) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="toc-tick"
                      data-title={item.text}
                      data-depth={item.depth}
                      aria-label={`${index + 1}. ${item.text}`}
                    >
                      <span className="toc-line" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <Comments
          pageId={slug}
          pageUrl={`https://arkleselect.github.io/posts/${slug}`}
          pageTitle={post.title}
        />
      </div>
    </div>
  );
}
