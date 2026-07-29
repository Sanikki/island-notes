import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import type { Components } from 'react-markdown';

/** 表格渲染后自动合并首列连续的空白单元格（实现 rowspan） */
function useAutoMerge(ref: React.RefObject<HTMLTableElement | null>) {
  useEffect(() => {
    const tbl = ref.current;
    if (!tbl) return;
    const tbody = tbl.querySelector('tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (!rows.length) return;

    let i = 0;
    while (i < rows.length) {
      const cell = rows[i].cells[0];
      const text = cell?.textContent?.trim() || '';
      if (text) {
        let span = 1;
        for (let j = i + 1; j < rows.length; j++) {
          const nextText = rows[j].cells[0]?.textContent?.trim() || '';
          if (!nextText) {
            span++;
            rows[j].cells[0].style.display = 'none';
          } else {
            break;
          }
        }
        if (span > 1) {
          cell.rowSpan = span;
        }
        i += span;
      } else {
        i++;
      }
    }
  });
}

// 自定义渲染：让链接在新标签页打开，表格自动合并首列
const components: Components = {
  a: ({ node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
  table: ({ node, ...props }) => {
    const tableRef = useRef<HTMLTableElement>(null);
    useAutoMerge(tableRef);
    return (
      <div className="md-table-wrap">
        <table ref={tableRef} {...props} />
      </div>
    );
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
