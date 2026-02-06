import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroTitle, HeroSubtitle } from "@/components/hero-title";
import { FiFileText, FiLayers, FiRefreshCw, FiCode, FiMapPin, FiMusic, FiCommand } from "react-icons/fi";
import Dither from "@/components/dither/Dither";

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

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="dither-background-wrapper">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
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
      <section className="flex flex-col items-center" style={{ marginBottom: 'calc(var(--spacing) * 50)' }}>
        <div className="max-w-xl w-full p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent relative group">
          <FiCommand className="absolute top-4 left-4 w-4 h-4 text-white/20" />
          <p className="font-press-start text-xs leading-loose text-center text-white/80 p-4">
            "DARKNESS IS BOUNDLESS, YET HUMANITY FOOLISHLY YEARNS FOR LIGHT."
          </p>
          <div className="text-[10px] text-right text-white/20 font-mono mt-4">— OVERRIDE</div>
        </div>
      </section>

      <div className="space-y-24">
        {/* 方案4: GitHub Contribution 模拟贡献墙 - HUD 风格 - 去边框去背景 */}
        <section className="relative group">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-2">
            <div className="h-1 w-1 bg-white animate-pulse"></div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">足迹</h2>
          </div>

          <div className="overflow-hidden p-1">
            <div className="grid grid-cols-[repeat(52,1fr)] gap-[2px]">
              {Array.from({ length: 52 * 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-[1px] transition-colors duration-500 ${Math.random() > 0.8 ? 'bg-white/40' :
                    Math.random() > 0.6 ? 'bg-white/20' :
                      Math.random() > 0.4 ? 'bg-white/10' : 'bg-white/[0.03]'
                    }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-[9px] font-mono text-white/10 uppercase tracking-tighter">
            <span>Data_Stream_Initialized</span>
            <span>Check_sum: OK</span>
          </div>
        </section>

        {/* 工具集 Section - HUD 风格 - 去边框去背景 */}
        <section className="relative">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-2">
            <div className="h-1 w-1 bg-white animate-pulse"></div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">工具</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="group/item relative p-5 transition-all duration-500"
              >
                {/* Minimal Corner */}
                <span className="absolute top-0 right-0 w-1 h-1 bg-white/10 group-hover/item:bg-white/40 transition-colors"></span>

                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="text-white/40 group-hover/item:text-white transition-colors">
                      {tool.icon}
                    </div>
                    <span className="text-[9px] font-mono text-white/10 group-hover/item:text-white/30">0x{Math.floor(Math.random() * 100).toString(16).toUpperCase()}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white/40 group-hover/item:text-white/90 mb-1 tracking-tight transition-colors">{tool.name}</h3>
                    <p className="text-[10px] text-white/30 leading-relaxed font-mono uppercase">{tool.description}</p>
                  </div>

                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-[10px] font-mono text-white/20 hover:text-white pt-4 mt-2 group/btn"
                  >
                    <span>LAUNCH_MODULE</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

