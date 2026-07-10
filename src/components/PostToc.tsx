import { useEffect, useState } from 'react';
import { Progress, Icon } from 'animal-island-ui';
import type { TocItem } from '../lib/posts';

/**
 * 文章左侧目录侧边栏：
 * - 渲染 H1–H3 标题导航，点击平滑滚动到对应锚点
 * - scroll-spy 高亮当前所在章节
 * - 下方用 UI 库的 Progress 组件显示阅读进度（按窗口滚动比例计算）
 */
export function PostToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState('');
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const OFFSET = 90; // 顶部导航高度 + 余量，scroll-spy 判定线

    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        docHeight > 0
          ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
          : 0;
      setPercent(Math.round(pct));

      // scroll-spy：取视口判定线之上、离顶部最近的标题
      let current = items[0]?.id ?? '';
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top - OFFSET <= 0) {
          current = it.id;
        } else {
          break;
        }
      }

      // 边界：已滚动到(接近)页面底部时，强制高亮最后一个标题。
      // 否则末节内容过短时，页面无法滚到让末标题越过判定线，active 会停在倒数第二个。
      if (docHeight - scrollTop <= OFFSET + 4) {
        current = items[items.length - 1]?.id ?? current;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <aside className="post-toc">
      <div className="post-toc__inner">
        <div className="post-toc__title">
          <Icon name="icon-design" size={16} /> 本文目录
        </div>
        <nav className="post-toc__nav">
          <ul>
            {items.map((it) => (
              <li
                key={it.id}
                className={`post-toc__item lvl-${it.level}${
                  activeId === it.id ? ' is-active' : ''
                }`}
              >
                <a href={`#${it.id}`} onClick={(e) => handleClick(e, it.id)}>
                  {it.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="post-toc__progress">
          <Progress percent={percent} size="small" showInfo={false} />
          <span className="post-toc__progress-label">已读 {percent}%</span>
        </div>
      </div>
    </aside>
  );
}
