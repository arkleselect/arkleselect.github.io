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
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="rounded border border-white/10 bg-white/[0.03] p-8">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            POST
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">
            {post.date}
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-white/80 md:text-3xl">
          {post.title}
        </h1>

        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="relative">
            <MarkdownContent
              html={post.html}
              className="prose prose-invert max-w-none text-sm leading-relaxed"
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

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 本文信息 */}
            <div className="p-6 bg-white/[0.02] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-500/30 group-hover:bg-blue-500 transition-colors duration-500" />
              <h3 className="text-[11px] font-bold text-white/90 mb-4 flex items-center gap-2 font-mono uppercase tracking-[0.2em]">
                <span className="w-1.5 h-3 bg-blue-500/80" />
                Article_Info / 本文信息
              </h3>
              <ul className="space-y-3 text-[13px]">
                <li className="flex gap-3">
                  <span className="text-white/20 font-mono whitespace-nowrap w-20">作者 / AUTHOR</span>
                  <span className="text-white/70 tracking-tight">arkleselect</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/20 font-mono whitespace-nowrap w-20">发布 / DATE</span>
                  <span className="text-white/70 tracking-tight">{post.date}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-white/20 font-mono whitespace-nowrap w-20">分类 / CAT</span>
                  <span className="text-white/70 tracking-tight">{post.category || 'Undefined'}</span>
                </li>
                <li className="flex gap-3 overflow-hidden">
                  <span className="text-white/20 font-mono whitespace-nowrap w-20 shrink-0">链接 / LINK</span>
                  <a href={`https://arkleselect.github.io/posts/${slug}`} className="text-white/40 hover:text-blue-400/80 transition-colors break-all underline decoration-white/10 decoration-dotted tracking-tight">
                    {`https://arkleselect.github.io/posts/${slug}`}
                  </a>
                </li>
              </ul>
            </div>

            {/* 版权许可 */}
            <div className="p-6 bg-white/[0.02] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-orange-500/30 group-hover:bg-orange-500 transition-colors duration-500" />
              <h3 className="text-[11px] font-bold text-white/90 mb-4 flex items-center gap-2 font-mono uppercase tracking-[0.2em]">
                <span className="w-1.5 h-3 bg-orange-500/80" />
                License / 版权许可
              </h3>
              <div className="space-y-3 text-[13px]">
                <p className="text-white/60 leading-relaxed tracking-tight">
                  本文所有内容（包括图片）均采用 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans" target="_blank" className="text-orange-400/70 hover:text-orange-400 underline decoration-orange-400/20 transition-all font-bold">CC BY-SA 4.0</a> 协议授权。
                </p>
                <p className="text-white/20 text-[11px] font-mono italic leading-snug">
                  * 转载请注明出处，并附上本声明内容。
                </p>
                <div className="pt-2 flex gap-3 opacity-20 grayscale brightness-200">
                  <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-sa.svg" alt="CC BY-SA" className="h-6" />
                </div>
              </div>
            </div>
          </div>

          <Comments
            pageId={slug}
            pageUrl={`https://arkleselect.github.io/posts/${slug}`}
            pageTitle={post.title}
          />
        </div>
      </div>
    </div>
  );
}
