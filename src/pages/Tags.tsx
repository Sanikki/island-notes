import { useParams, Link, useNavigate } from 'react-router-dom';
import { Title, Card, Button, Divider, Icon } from 'animal-island-ui';
import {
  getAllTags,
  getPostsByTag,
} from '../lib/posts';
import { PostCard } from '../components/PostCard';

// 每个标签一套花纹卡片主题：主色 + 图标
const TAG_THEME = [
  { c: '#19c8b9', icon: 'icon-critterpedia' },
  { c: '#7DC395', icon: 'icon-design' },
  { c: '#FFC857', icon: 'icon-diy' },
  { c: '#FF9EC4', icon: 'icon-map' },
  { c: '#FF9F5A', icon: 'icon-chat' },
  { c: '#B58FF5', icon: 'icon-shopping' },
  { c: '#FF7A7A', icon: 'icon-miles' },
] as const;

export function TagsPage() {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const decodedTag = tag ? decodeURIComponent(tag) : undefined;
  const allTags = getAllTags();

  if (!decodedTag) {
    return (
      <div className="tags-page">
        <Title size="large" color="app-green">
          <Icon name="icon-variant" size={22} /> 标签分类
        </Title>
        <Card color="app-yellow" className="tags-page__intro">
          点击下面的任意标签卡片，就能找到属于它的全部笔记。
        </Card>
        <Divider type="wave-yellow" />
        <div className="tags-cloud">
          {allTags.map((t, i) => {
            const th = TAG_THEME[i % TAG_THEME.length];
            return (
              <button
                key={t.name}
                type="button"
                className="tag-card"
                style={{ ['--c' as string]: th.c } as React.CSSProperties}
                onClick={() => navigate(`/blog/tags/${encodeURIComponent(t.name)}`)}
              >
                <span className="tag-card__strip" />
                <span className="tag-card__head">
                  <span className="tag-card__name">#{t.name}</span>
                  <Icon name={th.icon} size={26} className="tag-card__icon" />
                </span>
                <span className="tag-card__count">{t.count} 篇笔记</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const list = getPostsByTag(decodedTag);

  return (
    <div className="tags-page">
      <Link to="/blog/tags" className="post-detail__back">
        ← 全部标签
      </Link>
      <Title size="large" color="purple">
        #{decodedTag}
      </Title>
      <span className="home__count">共 {list.length} 篇</span>
      <Divider type="dashed-brown" />
      {list.length === 0 ? (
        <Card color="app-pink" className="home__empty">
          这个标签下还没有笔记哦～
        </Card>
      ) : (
        <div className="post-list">
          {list.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
      <div className="post-detail__footer">
        <Link to="/blog/tags">
          <Button type="default">← 返回标签云</Button>
        </Link>
      </div>
    </div>
  );
}
