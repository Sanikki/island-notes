import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Card, Button, Divider, Icon } from 'animal-island-ui';
import { getPost, extractToc, getAuthorAvatar } from '../lib/posts';
import { Markdown } from '../components/Markdown';
import { TagLink } from '../components/TagLink';
import { PostToc } from '../components/PostToc';

export function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return (
      <Card color="app-pink" className="post-detail__missing">
        <Title size="middle" color="app-pink">
          咦？这篇笔记好像被风吹走了
        </Title>
        <Link to="/blog">
          <Button type="primary">回到首页</Button>
        </Link>
      </Card>
    );
  }

  const toc = useMemo(() => extractToc(post.body), [post]);

  return (
    <div className="post-detail">
      <div className="post-layout">
        <PostToc items={toc} />

        <article className="post-main">
          <Link to="/blog" className="post-detail__back">
            ← 返回列表
          </Link>

          <Title size="large" color="app-blue" className="post-detail__title">
            {post.title}
          </Title>

          <Card color="default" className="post-author-card">
            <div className="author-card__inner">
              <div className="author-card__avatar">
                <img src={getAuthorAvatar(post.author)} alt={post.author} className="about-card__avatar-img" />
              </div>
              <div className="author-card__info">
                <div className="author-card__name">{post.author || '岛民'}</div>
                <div className="author-card__meta">
                  {post.date && (
                    <span className="author-card__item">
                      <Icon name="icon-design" size={14} />
                      发布于 {post.date}
                    </span>
                  )}
                  {post.updated && post.updated !== post.date && (
                    <span className="author-card__item">
                      <Icon name="icon-miles" size={14} />
                      更新于 {post.updated}
                    </span>
                  )}
                  <span className="author-card__item">
                    <Icon name="icon-camera" size={14} />
                    {post.wordCount} 字
                  </span>
                  <span className="author-card__item">
                    <Icon name="icon-chat" size={14} />
                    约 {post.readingMinutes} 分钟读完
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="post-detail__tags">
            {post.tags.map((tag) => (
              <TagLink key={tag} tag={tag} />
            ))}
          </div>

          <Divider type="line-brown" />

          <Card color="default" className="post-detail__body">
            <Markdown content={post.body} />
          </Card>

          <div className="post-detail__footer">
            <Link to="/blog">
              <Button type="default">← 回到小岛首页</Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
