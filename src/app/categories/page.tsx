import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const categories = [
  { name: "技术", slug: "tech", count: 1 },
  { name: "生活", slug: "life", count: 0 },
  { name: "工具", slug: "tools", count: 2 },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">分类</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <Card className="transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category.name}
                  <span className="text-sm font-normal text-muted-foreground">
                    {category.count} 篇
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
