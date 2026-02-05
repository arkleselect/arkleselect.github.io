import { getPostBySlug, getPostSlugs } from "@/lib/content";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

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

        <h1 className="mt-6 text-2xl font-semibold text-white/90 md:text-3xl">
          {post.title}
        </h1>

        <div className="mt-6 border-t border-white/10 pt-6">
          {post.toc.length > 0 ? (
            <div className="mb-6 rounded border border-white/10 bg-white/[0.02] p-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                目录
              </div>
              <ul className="mt-3 space-y-1 text-sm text-white/70">
                {post.toc.map((item) => (
                  <li key={item.id} className={item.depth === 3 ? "ml-4" : ""}>
                    <a href={`#${item.id}`} className="hover:text-white">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div
            className="prose prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    </div>
  );
}
