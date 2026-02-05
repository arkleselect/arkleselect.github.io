import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 示例文章数据
const posts: Record<string, { title: string; content: string; date: string }> = {
  hello: {
    title: "简单开头",
    content: "这是一个新的开始，欢迎来到我的博客。",
    date: "2024-01-01",
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">文章未找到</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{post.date}</p>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p>{post.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
