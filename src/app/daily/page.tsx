import { Card, CardContent, CardHeader } from "@/components/ui/card";

const dailyPosts = [
  {
    id: 1,
    content: "今天开始搭建新博客，使用 Next.js + shadcn/ui，感觉很棒！",
    date: "2024-01-01",
  },
];

export default function DailyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">日常</h1>
      <div className="grid gap-4">
        {dailyPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-2">
              <span className="text-sm text-muted-foreground">{post.date}</span>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
