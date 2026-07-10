import { Link } from 'react-router-dom';
import { Card, Icon } from 'animal-island-ui';
import type { CardColor } from 'animal-island-ui';
import type { Post } from '../lib/posts';
import { TagLink } from './TagLink';

const CARD_COLORS = [
  'app-blue',
  'app-green',
  'app-yellow',
  'app-pink',
  'app-orange',
  'purple',
] as const;

function colorForSlug(slug: string): CardColor {
  let sum = 0;
  for (const ch of slug) sum += ch.charCodeAt(0);
  return CARD_COLORS[sum % CARD_COLORS.length];
}

export function PostCard({ post }: { post: Post }) {
  const color = colorForSlug(post.slug);
  return (
    <Card color={color} pattern={color} className="post-card">
      <Link to={`/blog/post/${post.slug}`} className="post-card__title-link">
        <h2 className="post-card__title">{post.title}</h2>
      </Link>
      <div className="post-card__meta">
        {post.date && (
          <span>
            <Icon name="icon-design" size={13} /> 发布于 {post.date}
          </span>
        )}
      </div>
      {post.excerpt && <p className="post-card__excerpt">{post.excerpt}</p>}
      <div className="post-card__tags">
        {post.tags.map((tag) => (
          <TagLink key={tag} tag={tag} />
        ))}
      </div>
    </Card>
  );
}
