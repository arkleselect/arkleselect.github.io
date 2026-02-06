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
      if (pre.closest('.code-block-wrapper')) return;

      const code = pre.querySelector('code');
      if (!code) return;

      // 创建包装容器
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode?.insertBefore(wrapper, pre);

      // 创建页眉 (放置复制按钮)
      const header = document.createElement('div');
      header.className = 'code-block-header';

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'code-copy-btn';
      copyBtn.textContent = '复制';
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent ?? '');
          copyBtn.textContent = '已复制';
          copyBtn.setAttribute('data-copied', 'true');
          setTimeout(() => {
            copyBtn.textContent = '复制';
            copyBtn.removeAttribute('data-copied');
          }, 1500);
        } catch (err) {
          copyBtn.textContent = '失败';
        }
      });

      header.appendChild(copyBtn);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      // 处理折叠逻辑
      const MAX_HEIGHT = 400;
      requestAnimationFrame(() => {
        if (pre.scrollHeight > MAX_HEIGHT + 50) {
          wrapper.setAttribute('data-collapsed', 'true');

          const footer = document.createElement('div');
          footer.className = 'code-block-footer';

          const expandBtn = document.createElement('button');
          expandBtn.type = 'button';
          expandBtn.className = 'code-expand-btn';
          expandBtn.textContent = '展开全部';

          expandBtn.addEventListener('click', () => {
            const isCollapsed = wrapper.getAttribute('data-collapsed') === 'true';
            if (isCollapsed) {
              wrapper.setAttribute('data-collapsed', 'false');
              expandBtn.textContent = '收起代码';
              expandBtn.classList.add('is-expanded');
            } else {
              wrapper.setAttribute('data-collapsed', 'true');
              expandBtn.textContent = '展开全部';
              expandBtn.classList.remove('is-expanded');
              wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });

          footer.appendChild(expandBtn);
          wrapper.appendChild(footer);
        }
      });
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
