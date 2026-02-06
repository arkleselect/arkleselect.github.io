import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/content";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export default async function PostsPage() {
  const posts = await getAllPosts() as Post[];
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Posts List */}
      <section className="mx-auto max-w-3xl space-y-2.5">
        {posts.map((post) => (
          <a key={post.slug} href={`/posts/${post.slug}`} className="block">
            <Card className="rounded border-white/10 bg-white/[0.03] py-3 hover:bg-white/[0.05] transition-colors">
              <CardHeader className="gap-1.5 px-4 py-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-base text-white/90">{post.title}</CardTitle>
                    <CardDescription className="text-white/40 text-[13px]">
                      {post.description}
                    </CardDescription>
                    <span className="mt-1 text-[10px] font-mono uppercase tracking-widest text-white/40">
                      {post.date}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </a>
        ))}
      </section>
    </div>
  );
}
