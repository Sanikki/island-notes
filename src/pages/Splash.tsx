import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Divider,
  Icon,
  Typewriter,
  type IconName,
} from 'animal-island-ui';

const FEATURES: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'icon-critterpedia', title: '文章列表', desc: '首页以卡片网格展示全部笔记，支持标题 / 摘要 / 标签实时搜索。' },
  { icon: 'icon-map', title: '标签分类', desc: '每个标签一张花纹卡片，点一下就能收齐同一主题下的所有文章。' },
  { icon: 'icon-diy', title: 'Markdown 渲染', desc: '完整支持标题、代码块、表格、引用与列表，代码自动高亮。' },
  { icon: 'icon-miles', title: '关于小岛', desc: 'SANIKKI介绍、常见问题折叠面板，还有一座实时小岛时钟。' },
  { icon: 'icon-chat', title: 'Agent 笔记', desc: '专门收录 AI Agent 相关的学习笔记，从工具调用到自主规划。' },
  { icon: 'icon-camera', title: '移动友好', desc: '响应式布局，手机、平板、桌面都能舒服地阅读与浏览。' },
];

const STACK = ['Vite', 'React 18', 'animal-island-ui', 'react-markdown', 'TypeScript'];

const POST_SNIPPET = `---
title: 我的新笔记
date: 2026-07-09
tags: [前端, 学习]
excerpt: 一句话简介
---

# 正文从这里开始

用 **Markdown** 写就好啦～`;

export function Splash() {
  const navigate = useNavigate();
  const [showHint, setShowHint] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  const enter = () => {
    // 带上标记，博客首页据此决定是否播放 loading 覆盖层
    navigate('/blog', { state: { fromSplash: true } });
  };

  const handleScroll = () => {
    const el = pageRef.current;
    if (el) setShowHint(el.scrollTop < 70);
  };

  useEffect(() => {
    document.title = '小岛笔记 · 动物森友会风个人博客';
    return () => {
      document.title = '小岛笔记 · 技术博客';
    };
  }, []);

  return (
    <div className="landing" ref={pageRef} onScroll={handleScroll}>
      {/* ---------- Hero ---------- */}
      <section className="landing__hero">
        <div className="landing__hero-inner">
          <div className="landing__hero-text">
            <h1 className="landing__title">
              小岛笔记
              <span className="landing__version">v1.0</span>
            </h1>
            <Typewriter speed={55}>
              <p className="landing__subtitle">
                一个动物森友会风格的个人技术博客，记录我的学习笔记与生活随笔
              </p>
            </Typewriter>
            <div className="landing__actions">
              <Button type="primary" size="large" onClick={enter}>
                开始使用 →
              </Button>
            </div>
          </div>
          <div className="landing__hero-art">
            <img
              src="/bg/animal_icon.png"
              alt="动物森友会小岛"
              className="landing__art-img"
              decoding="async"
            />
          </div>
        </div>

        <div
          className={`landing__scroll-hint ${showHint ? '' : 'is-hidden'}`}
          onClick={() =>
            pageRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
          }
        >
          <span>向下滑动</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="#FFF9E6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* ---------- 这是什么 ---------- */}
      <section className="landing__section">
        <h2 className="landing__section-title">这是什么</h2>
        <Card className="landing__intro-card">
          <p className="landing__section-desc">
            小岛笔记是一座属于我的安静小岛。这里用 GitHub 上开源的
            <b> 动物森友会 UI（animal-island-ui）</b>
            搭建，把技术学习与日常思考都收进暖暖的卡片里——愿你放慢脚步，淘到一点有用的东西。
          </p>
        </Card>
      </section>

      <Divider style={{ width: 800, maxWidth: '90%', margin: '0 auto' }} />

      {/* ---------- 特性 ---------- */}
      <section className="landing__section">
        <h2 className="landing__section-title">特性</h2>
        <p className="landing__section-desc">为什么这座小岛值得逛逛</p>
        <div className="landing__features">
          {FEATURES.map((f) => (
            <Card key={f.title} className="landing__feature">
              <div className="landing__feature-icon">
                <Icon name={f.icon} size={30} />
              </div>
              <div className="landing__feature-title">{f.title}</div>
              <div className="landing__feature-desc">{f.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      <Divider style={{ width: 800, maxWidth: '90%', margin: '0 auto' }} />

      {/* ---------- 技术栈 ---------- */}
      <section className="landing__section">
        <h2 className="landing__section-title">技术栈</h2>
        <p className="landing__section-desc">轻量、现代、开箱即用</p>
        <div className="landing__stack">
          {STACK.map((s) => (
            <span key={s} className="landing__chip">
              {s}
            </span>
          ))}
        </div>
      </section>

      <Divider style={{ width: 800, maxWidth: '90%', margin: '0 auto' }} />

      {/* ---------- 怎么写文章 ---------- */}
      <section className="landing__section">
        <h2 className="landing__section-title">怎么写文章</h2>
        <Card className="landing__intro-card">
          <p className="landing__section-desc">
            在 <code>src/content/posts/</code> 新建一个 <code>.md</code> 文件即可，无需改动代码
          </p>
        </Card>
        <pre className="landing__code">
          <code>{POST_SNIPPET}</code>
        </pre>
      </section>

      {/* ---------- 底部 CTA ---------- */}
      <section className="landing__cta">
        <Button type="primary" size="large" onClick={enter}>
          进入小岛 →
        </Button>
        <p className="landing__cta-tip">基于 animal-island-ui · MIT License</p>
      </section>
    </div>
  );
}
