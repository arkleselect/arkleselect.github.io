import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const posts = [
  {
    title: "简单开头",
    description: "这是一个新的开始",
    date: "2024-01-01",
    slug: "hello",
  },
];

export default function PostsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">合集</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <Card className="transition-colors hover:bg-accent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{post.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                </div>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
