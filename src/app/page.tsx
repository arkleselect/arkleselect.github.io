import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroTitle, HeroSubtitle } from "@/components/hero-title";
import { FiFileText, FiLayers, FiRefreshCw, FiCode, FiMapPin, FiMusic, FiCommand } from "react-icons/fi";

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

const categories = [
  { title: "开发日记", count: 12, icon: <FiCode /> },
  { title: "设计思考", count: 5, icon: <FiLayers /> },
  { title: "生活碎片", count: 8, icon: <FiFileText /> },
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

      {/* 方案1: Status/Now 极简状态栏 */}
      <section className="mb-12 flex justify-center">
        <div className="flex items-center gap-6 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] uppercase tracking-widest text-white/40 font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            STATUS: CODING
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <FiMapPin className="w-3 h-3 text-white/30" />
            SHANDONG, CN
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <FiMusic className="w-3 h-3 text-white/30" />
            LO-FI BEATS
          </div>
        </div>
      </section>

      {/* 方案3: Daily Quote 像素风一言 */}
      <section className="mb-24 flex flex-col items-center">
        <div className="max-w-xl w-full p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative group">
          <FiCommand className="absolute top-4 left-4 w-4 h-4 text-white/20" />
          <p className="font-press-start text-xs leading-loose text-center text-white/80 p-4">
            "DARKNESS IS BOUNDLESS, YET HUMANITY FOOLISHLY YEARNS FOR LIGHT."
          </p>
          <div className="text-[10px] text-right text-white/20 font-mono mt-4">— SYSTEM_OVERRIDE</div>
        </div>
      </section>

      <div className="flex gap-12 relative">
        {/* 纵向结构线 */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>

        <div className="flex-1 md:pl-8 space-y-24">
          {/* 方案4: GitHub Contribution 模拟贡献墙 - 重构为纹理风格 */}
          <section>
            <div className="flex items-baseline justify-between mb-2 border-b border-white/5 pb-2">
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">Footprints</h2>
              <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">ArkleSelect // 2024-2025</span>
            </div>
            <div className="rounded-sm border border-white/5 bg-black/10 overflow-hidden p-1">
              <div className="grid grid-cols-[repeat(52,1fr)]">
                {Array.from({ length: 52 * 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square ${Math.random() > 0.8 ? 'bg-white/30' :
                      Math.random() > 0.6 ? 'bg-white/15' :
                        Math.random() > 0.4 ? 'bg-white/5' : 'bg-transparent'
                      }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 工具集 Section - 重构为侧标设计 */}
          <section>
            <div className="flex items-baseline justify-between mb-6 border-b border-white/5 pb-2">
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">Core_Tools</h2>
              <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">V.1.0.4 // SYSTEM_ACTIVE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="group relative flex flex-col justify-between p-4 border-l border-white/10 hover:border-white transition-all duration-500"
                >
                  <div className="flex flex-col gap-3">
                    <div className="text-white/30 group-hover:text-white transition-colors">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white/80 group-hover:text-white mb-1 transition-colors uppercase tracking-tight">{tool.name}</h3>
                      <p className="text-[10px] text-white/30 leading-relaxed font-mono">{tool.description.toUpperCase()}</p>
                    </div>
                  </div>

                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 text-[10px] font-mono text-white/20 hover:text-white flex items-center gap-1 transition-all"
                  >
                    ACCESS_URL <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
