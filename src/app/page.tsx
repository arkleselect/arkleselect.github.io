import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroTitle, HeroSubtitle } from "@/components/hero-title";
import Carousel from "@/components/carousel/Carousel";
import { FiCode, FiFileText, FiLayers } from "react-icons/fi";

const tools = [
  {
    name: "GenerateExcel",
    description: "Excel 生成工具",
    link: "https://github.com/arkleselect/GenerateExcel",
    icon: <FiFileText className="carousel-icon" />
  },
  {
    name: "SmartStitcher",
    description: "智能拼接工具",
    link: "https://github.com/arkleselect/Tools",
    icon: <FiLayers className="carousel-icon" />
  },
];

const carouselItems = tools.map((tool, index) => ({
  title: tool.name,
  description: tool.description,
  id: index,
  icon: tool.icon,
  link: tool.link
}));


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
        <div style={{ height: '220px', position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Carousel
            items={carouselItems}
            baseWidth={300}
            autoplay={false}
            autoplayDelay={3000}
            pauseOnHover={false}
            loop={false}
            round={false}
          />
        </div>
      </section>
    </div>
  );
}
