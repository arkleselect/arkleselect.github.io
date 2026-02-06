'use client';

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const navItems = [
  { name: "首页", href: "/" },
  { name: "合集", href: "/posts" },
  {
    name: "分类",
    href: "/moments",
    target: "_blank",
    icon: <Image src="/icon3.svg" alt="分类" width={42} height={42} className="opacity-90 invert" />,
  },
  { name: "日常", href: "/daily" },
  { name: "关于", href: "/about" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-center px-4">
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href ?? "#"}
              target={item.target}
              rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label={item.name}
              title={item.name}
              onClick={(event) => {
                if (!item.href) event.preventDefault();
              }}
            >
              {item.icon ? item.icon : item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
