import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroTitle, HeroSubtitle } from "@/components/hero-title";
import { FiFileText, FiLayers, FiRefreshCw } from "react-icons/fi";

const tools = [
  {
    name: "GenerateExcel",
    description: "Excel 生成工具",
    link: "https://github.com/arkleselect/GenerateExcel",
    icon: <FiFileText className="w-6 h-6" />
  },
  {
    name: "SmartStitcher",
    description: "智能拼接工具",
    link: "https://github.com/arkleselect/Tools",
    icon: <FiLayers className="w-6 h-6" />
  },
  {
    name: "SyncTool",
    description: "内网传输工具",
    link: "https://github.com/arkleselect/sync_tool",
    icon: <FiRefreshCw className="w-6 h-6" />
  },
];

const recentPosts = [
  {
    title: "简单开头",
    description: "这是一个新的开始",
    date: "2024-01-01",
    slug: "hello",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 flex min-h-[40vh] flex-col items-center justify-center text-center">
        <HeroTitle />
        <div className="mt-6 text-muted-foreground">
          <HeroSubtitle />
        </div>
      </section>

      {/* 最近文章 Section */}
      <section className="mb-24">
        <h2 className="mb-5 text-xl font-semibold text-center md:text-left">最近</h2>
        <div className="grid gap-4">
          {recentPosts.map((post) => (
            <Card key={post.slug} className="transition-colors hover:bg-accent border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{post.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                </div>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/posts/${post.slug}`}>阅读更多 →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 工具集 Section */}
      <section className="flex flex-col items-center">
        <h2 className="mb-8 text-xl font-semibold">工具集</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/60"
            >
              <div className="flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-transform group-hover:scale-105">
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">{tool.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed mb-4">{tool.description}</p>
                </div>
              </div>

              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white transition-all hover:bg-white hover:text-black self-start"
              >
                查看 →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
