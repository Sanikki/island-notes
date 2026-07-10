import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'animal-island-ui';
import type { TagColor, TagSize, TagVariant } from 'animal-island-ui';

interface TagLinkProps {
  tag: string;
  color?: TagColor;
  variant?: TagVariant;
  size?: TagSize;
  children?: ReactNode;
}

// Tag 内部渲染为 <button>，不能直接包在 <Link>(<a>) 里（非法 DOM 嵌套）。
// 这里用 onClick + navigate 实现跳转，既保留动森风标签外观，又语义正确。
export function TagLink({ tag, color = 'app-green', variant = 'outlined', size = 'small', children }: TagLinkProps) {
  const navigate = useNavigate();
  return (
    <Tag
      color={color}
      variant={variant}
      size={size}
      className="tag-link"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/blog/tags/${encodeURIComponent(tag)}`)}
    >
      {children ?? `#${tag}`}
    </Tag>
  );
}
