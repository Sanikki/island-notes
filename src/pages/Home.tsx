import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Title, Input, Divider, Card, Loading, Icon } from 'animal-island-ui';
import { posts } from '../lib/posts';
import { PostCard } from '../components/PostCard';

export function Home() {
  const location = useLocation();
  // 仅当从落地页「/」跳转过来（携带 state.fromSplash）时才播放 cover 动画；
  // 直接刷新 / 从其他页面进入时 state 为空，fromSplash 为 false，不挂载、不盖屏。
  const fromSplash =
    (location.state as { fromSplash?: boolean } | null)?.fromSplash === true;

  // 初始 active 与 fromSplash 一致：从落地页来=true（铺满），否则=false（无覆盖层）
  const [active, setActive] = useState(fromSplash);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? '').toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="home" style={{ position: 'relative', minHeight: '100%' }}>
      <section className="hero">
        <Title size="large" color="app-yellow">
          <Icon name="icon-map" size={22} /> 小岛笔记
        </Title>
        <p className="hero__text">
          欢迎来到这座安静的小岛。这里收集了我的技术学习笔记与生活随笔——
          愿你在此放慢脚步，淘到一点有用的东西。
        </p>
      </section>

      <section className="home__toolbar">
        <Input
          placeholder="搜索标题、摘要或标签…"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          className="home__search"
        />
        <span className="home__count">共 {filtered.length} 篇</span>
      </section>

      <Divider type="wave-yellow" />

      {filtered.length === 0 ? (
        <Card color="app-pink" className="home__empty">
          没有找到匹配的笔记，换个关键词试试吧～
        </Card>
      ) : (
        <div className="post-list">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {/* 仅当从落地页进入时挂载 Loading（保证初始 active=true，不会黑屏闪烁）；
          active true→false 时由库播放圆形遮罩扩散收起动画露出底层内容。
          直接刷新 / 其他页进入不挂载，无任何覆盖层。 */}
      {fromSplash && (
        <Loading
          active={active}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
}
