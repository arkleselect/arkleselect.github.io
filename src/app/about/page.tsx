import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <Avatar className="mx-auto h-20 w-20">
            <AvatarImage src="/avatar.webp" alt="Wpprqi" />
            <AvatarFallback className="text-xl">W</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-xl">关于我</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            The darkness is boundless
          </p>
          <p>
            欢迎来到我的个人博客。这里记录我的技术探索、工具分享和日常生活。
          </p>
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <a
                href="https://github.com/arkleselect"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
