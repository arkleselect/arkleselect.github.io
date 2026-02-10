'use client';

import { useState, useEffect, useCallback } from 'react';

interface Comment {
    nickname: string;
    content: string;
    created_at: string;
}

interface CommentsProps {
    pageId: string;
    pageUrl: string;
    pageTitle: string;
}

export default function Comments({ pageId }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [nickname, setNickname] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/comments?slug=${pageId}`);
            const data = await res.json();
            if (data.comments) {
                setComments(data.comments);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pageId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickname || !content || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: pageId, nickname, content }),
            });

            if (res.ok) {
                setContent('');
                fetchComments();
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 pt-8 border-t border-white/5 space-y-10">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="h-1 w-1 bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Terminal_Comments / 终端评论系统
                </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 gap-4">
                    <div className="relative group">
                        <span className="absolute left-3 top-2.5 text-[10px] font-mono text-white/20 group-focus-within:text-green-500/50 transition-colors">
                            &gt; NICKNAME:
                        </span>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                            placeholder="你的称呼..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-none px-3 py-2.5 pl-24 text-sm font-mono text-white/80 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all placeholder:text-white/10"
                        />
                    </div>
                    <div className="relative group">
                        <span className="absolute left-3 top-2.5 text-[10px] font-mono text-white/20 group-focus-within:text-green-500/50 transition-colors">
                            &gt; MESSAGE:
                        </span>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={3}
                            placeholder="输入评论内容..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-none px-3 py-2.5 pl-24 text-sm font-mono text-white/80 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all placeholder:text-white/10 resize-none"
                        />
                    </div>
                </div>
                <div className="flex justify-start">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative px-6 py-2 border border-green-500/20 bg-green-500/5 text-green-500/80 font-mono text-[10px] uppercase tracking-widest hover:bg-green-500/10 hover:border-green-500/40 hover:text-green-500 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed group overflow-hidden"
                    >
                        <span className="relative z-10">{isSubmitting ? 'EXECUTING...' : '[ EXECUTE_COMMIT ]'}</span>
                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-green-500/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                </div>
            </form>

            {/* Comment List */}
            <div className="space-y-6 max-w-3xl pt-4">
                <div className="flex items-center gap-4 text-[9px] font-mono text-white/20 uppercase tracking-tighter">
                    <span className="flex-shrink-0">Comment_Log_Output</span>
                    <div className="h-[1px] w-full bg-white/5" />
                </div>

                {isLoading ? (
                    <div className="py-10 text-center">
                        <span className="text-[10px] font-mono text-white/10 animate-pulse italic">
                            CONNECTING_D1_INSTANCE...
                        </span>
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map((comment, i) => (
                            <div key={i} className="group relative pl-4 border-l border-white/5 hover:border-green-500/40 transition-colors">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-[10px] font-mono text-green-500/60 uppercase">
                                        @{comment.nickname}
                                    </span>
                                    <span className="text-[9px] font-mono text-white/10 italic">
                                        [{new Date(comment.created_at).toLocaleString()}]
                                    </span>
                                </div>
                                <p className="text-[13px] text-white/60 leading-relaxed font-mono group-hover:text-white/80 transition-colors">
                                    {comment.content}
                                </p>
                                <div className="absolute left-[-1px] top-0 w-[1px] h-3 bg-green-500/0 group-hover:bg-green-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 border border-dashed border-white/5 text-center">
                        <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest italic">
                            No_Input_Signals_Detected
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
