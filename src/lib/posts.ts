import yaml from 'js-yaml';
import GithubSlugger from 'github-slugger';
import avatarSanikki from '../assets/bg/avatar_sanikki.jpg';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  author?: string;
  cover?: string;
  updated?: string;
}

export interface Post extends PostMeta {
  body: string;
  wordCount: number;
  readingMinutes: number;
}

// 通过 Vite 的 glob 把 content/posts 下的所有 .md 当作原始字符串 eager 导入
const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string, slug: string): Post {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  let meta: Record<string, unknown> = {};
  let body = raw;
  if (match) {
    try {
      meta = (yaml.load(match[1]) as Record<string, unknown>) || {};
    } catch (err) {
      // 单篇文章 frontmatter 写错（如误用 YAML 保留字符 @、`）时，
      // 仅丢弃该篇元数据、保留正文，避免整站文章模块崩溃白屏。
      console.warn(`[posts] 解析 "${slug}" 的 frontmatter 失败，已忽略其元数据：`, err);
      meta = {};
    }
    body = raw.slice(match[0].length);
  }
  const tags = Array.isArray(meta.tags) ? (meta.tags as unknown[]).map(String) : [];
  return {
    slug,
    title: typeof meta.title === 'string' ? meta.title : slug,
    date: toDateString(meta.date),
    tags,
    excerpt: typeof meta.excerpt === 'string' ? meta.excerpt : undefined,
    author: typeof meta.author === 'string' ? meta.author : undefined,
    cover: typeof meta.cover === 'string' ? meta.cover : undefined,
    updated: toDateString(meta.updated) || undefined,
    body: body.trim(),
    ...calcReading(body),
  };
}

/**
 * 把 frontmatter 里的日期归一化为 YYYY-MM-DD 字符串。
 * 注意：js-yaml 会把不带引号的 `date: 2026-07-08` 解析为 Date 对象（而非字符串），
 * 所以必须同时兼容 Date 与 string，否则日期会丢失、页面不显示时间。
 * Date 用 UTC 取值，避免时区把日期偏移一天。
 */
function toDateString(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, '0');
    const d = String(value.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof value === 'string') return value.trim();
  return '';
}

/**
 * 根据正文估算字数与阅读时长（中文按字符数、英文按单词数，统一约 400 字/分钟）。
 */
function calcReading(body: string): { wordCount: number; readingMinutes: number } {
  const text = body
    .replace(/```[\s\S]*?```/g, '') // 去除代码块
    .replace(/`([^`]+)`/g, '$1') // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 图片
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/^#{1,6}\s+/gm, '') // 标题符号
    .replace(/^>\s?/gm, '') // 引用符号
    .replace(/^[-*+]\s+/gm, '') // 列表符号
    .replace(/\s+/g, ''); // 空白
  const cn = (text.match(/[一-龥]/g) || []).length;
  const en = (text.match(/[a-zA-Z0-9]+/g) || []).length;
  const words = cn + en;
  return { wordCount: words, readingMinutes: Math.max(1, Math.round(words / 400)) };
}

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    return parseFrontmatter(raw, slug);
  })
  // 按发布时间（date）降序排列，最新的文章排在前面
  .sort((a, b) => {
    if (a.date === b.date) return 0;
    return a.date < b.date ? 1 : -1;
  });

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export interface TagInfo {
  name: string;
  count: number;
}

export function getAllTags(): TagInfo[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// 标签分组：一个菜单/分类聚合多个近义标签。
// 例：导航「Agent」聚合 AI / Agent / AI Agent 三者的文章，
// 但单独点 AI、AI Agent 标签卡片时仍只显示各自精确结果。
export const TAG_GROUPS: Record<string, string[]> = {
  Agent: ['AI', 'Agent', 'AI Agent'],
};

export function getPostsByTag(tag: string): Post[] {
  const group = TAG_GROUPS[tag];
  const tagsToMatch = group ?? [tag];
  return posts.filter((p) => p.tags.some((t) => tagsToMatch.includes(t)));
}

export interface TocItem {
  level: number; // 1=H1, 2=H2, 3=H3
  text: string;
  id: string; // 与 rehype-slug 生成的 id 一致，用于锚点跳转
}

/**
 * 从 markdown 正文解析 H1–H3 标题，生成目录数据。
 * 用 github-slugger 生成 id，保证与 Markdown.tsx 里 rehype-slug 渲染出的 id 完全一致。
 * 跳过代码块（```）内的 # 号，避免误判。
 */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].trim();
      if (!text) continue;
      items.push({ level, text, id: slugger.slug(text) });
    }
  }
  return items;
}

/**
 * 作者信息表：头像与署名的单一来源，避免在各组件里写死图片路径。
 * 新增作者时只需在此追加一项，全站（首页卡片、文章详情页、关于页）即自动生效。
 */
export const AUTHORS: Record<string, { name: string; avatar: string }> = {
  SANIKKI: {
    name: 'SANIKKI',
    avatar: avatarSanikki,
  },
};

/** 默认作者（兜底：文章未声明 author 时使用） */
export const DEFAULT_AUTHOR = 'SANIKKI';

/** 根据作者名取得头像；未知作者回退到默认作者头像，保证永远有图可引用。 */
export function getAuthorAvatar(author?: string): string {
  const key = author && AUTHORS[author] ? author : DEFAULT_AUTHOR;
  return AUTHORS[key]?.avatar ?? AUTHORS[DEFAULT_AUTHOR].avatar;
}
