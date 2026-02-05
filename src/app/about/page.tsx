
export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="space-y-3">
        <section className="rounded border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            {/* <span className="h-5 w-1 bg-white/60"></span> */}
            <h2 className="text-base font-semibold text-white/90">站点含义</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>在这里写你的站点名字来源、含义、故事背景。</p>
            <p>可以写一两段更长的文字，解释为什么做这个站点。</p>
          </div>
        </section>

        <section className="rounded border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            {/* <span className="h-5 w-1 bg-white/60"></span> */}
            <h2 className="text-base font-semibold text-white/90">搭建环境</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>写你使用的技术栈、部署方式、站点结构。</p>
            <p>如果有开源地址或代码仓库，也可以在这里加上。</p>
          </div>
        </section>

        <section className="rounded border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            {/* <span className="h-5 w-1 bg-white/60"></span> */}
            <h2 className="text-base font-semibold text-white/90">字体 / 视觉</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>写你使用的字体、配色逻辑、视觉风格。</p>
            <p>也可以解释为什么选择这种风格。</p>
          </div>
        </section>

        <section className="rounded border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            {/* <span className="h-5 w-1 bg-white/60"></span> */}
            <h2 className="text-base font-semibold text-white/90">联系方式</h2>
          </div>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <div>邮箱：yourname@email.com</div>
            <div>GitHub：github.com/yourname</div>
            <div>微博 / X / 其他社交：@yourhandle</div>
          </div>
        </section>
      </div>
    </div>
  );
}
