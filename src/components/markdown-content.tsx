'use client';

import { useEffect, useRef } from 'react';

type MarkdownContentProps = {
  html: string;
  className?: string;
};

export default function MarkdownContent({ html, className = '' }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pres = Array.from(container.querySelectorAll('pre'));

    pres.forEach((pre) => {
      if (pre.getAttribute('data-copy-ready') === 'true') return;
      pre.setAttribute('data-copy-ready', 'true');

      const code = pre.querySelector('code');
      if (!code) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy-btn';
      button.textContent = '复制';

      button.addEventListener('click', async () => {
        const text = code.textContent ?? '';
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = '已复制';
          button.setAttribute('data-copied', 'true');
          setTimeout(() => {
            button.textContent = '复制';
            button.removeAttribute('data-copied');
          }, 1200);
        } catch {
          button.textContent = '失败';
          setTimeout(() => {
            button.textContent = '复制';
          }, 1200);
        }
      });

      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
