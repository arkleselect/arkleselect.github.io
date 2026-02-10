'use client';

import { useEffect } from 'react';

interface CommentsProps {
    pageId: string;
    pageUrl: string;
    pageTitle: string;
}

export default function Comments({ pageId, pageUrl, pageTitle }: CommentsProps) {
    useEffect(() => {
        // 每次页面 ID 改变时重新渲染 Cusdis
        if ((window as any).CUSDIS) {
            (window as any).CUSDIS.initial();
        }
    }, [pageId]);

    return (
        <div className="mt-16 pt-8 border-t border-white/5">
            <div className="mb-8 flex items-center gap-2">
                <div className="h-1 w-1 bg-white/40 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Terminal_Comments
                </span>
            </div>

            <div
                id="cusdis_thread"
                data-host="https://cusdis.com"
                data-app-id="b538fbdd-6c33-4955-bbda-ea8456a45bcc"
                data-page-id={pageId}
                data-page-url={pageUrl}
                data-page-title={pageTitle}
                data-theme="dark"
                data-minimal="1"
                className="cusdis-container min-h-[400px]"
            />

            <script async defer src="https://cusdis.com/js/cusdis.es.js"></script>

            <style jsx global>{`
        #cusdis_thread {
          min-height: 400px;
        }
        #cusdis_thread iframe {
          color-scheme: dark;
          filter: invert(0) !important;
          min-height: 400px;
          height: auto !important;
        }
      `}</style>
        </div>
    );
}
