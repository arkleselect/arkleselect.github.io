import { getDailyEntries } from "@/lib/content";

export default async function DailyPage() {
  const dailyPosts = await getDailyEntries();
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      {/* Terminal Header */}
      <div className="mb-12 font-mono text-xs text-white/40">
        <p>login: user@arkle-system</p>
        <p>last login: {new Date().toLocaleDateString()} on ttys001</p>
        <p className="mt-2">Loading daily_logs.txt...</p>
      </div>

      <div className="space-y-8 font-mono">
        {dailyPosts.map((post, index) => (
          <div key={`${post.date}-${index}`} className="group">
            {/* Command Line */}
            <div className="flex items-center gap-3 text-sm text-green-500/80 mb-2">
              <span>➜</span>
              <span className="text-blue-400">~</span>
              <span className="text-white/60">cat log_{post.date}.txt</span>
            </div>

            {/* Output Content */}
            <div className="pl-6 border-l-2 border-white/5 mx-1">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title || post.date}
                  className="mb-3 w-full rounded border border-white/10"
                />
              ) : null}
              {post.title ? (
                <div className="mb-2 text-sm text-white/90">{post.title}</div>
              ) : null}
              <div
                className="prose prose-invert max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
              <div className="mt-2 text-[10px] text-white/20">
                status: archived
              </div>
            </div>
          </div>
        ))}

        {/* Blinking Cursor at the end */}
        <div className="flex items-center gap-3 text-sm text-green-500/80 pt-4">
          <span>➜</span>
          <span className="text-blue-400">~</span>
          <span className="inline-block w-2.5 h-4 bg-white/60 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
}
