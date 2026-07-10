import { Title, Card, Collapse, Time, Icon, Divider, Button } from 'animal-island-ui';
import { Link } from 'react-router-dom';
import { AUTHORS, DEFAULT_AUTHOR } from '../lib/posts';

const faqs = [
  {
    q: '这座小岛是做什么的？',
    a: '用来记录我的技术学习笔记、踩坑记录和生活随笔。希望对你也有一点点帮助。',
  },
  {
    q: '为什么是动物森友会的风格？',
    a: '因为我喜欢那种慢节奏、治愈又充满好奇心的生活方式。写代码也可以很温柔。',
  },
  {
    q: '文章是怎么写的？',
    a: '全部用 Markdown 撰写，通过 Vite 的 import.meta.glob 自动收集，渲染则交给 react-markdown。',
  },
  {
    q: '可以转载文章吗？',
    a: '欢迎非商业地转载，只需保留署名与原文链接即可。商用请联系我。',
  },
];

export function About() {
  return (
    <div className="about-page">
      <Title size="large" color="app-pink">
        <Icon name="icon-chat" size={22} /> 关于小岛
      </Title>

      <Card color="default" className="about-card">
        <div className="about-card__row">
          <span className="about-card__avatar">
            <img
              src={AUTHORS[DEFAULT_AUTHOR].avatar}
              alt={AUTHORS[DEFAULT_AUTHOR].name}
              className="about-card__avatar-img"
              decoding="async"
            />
          </span>
          <div>
            <h3 className="about-card__name">{AUTHORS[DEFAULT_AUTHOR].name}</h3>
            <p className="about-card__bio">
              一名喜欢前端与开源的开发者，日常在浏览器的小岛上「钓鱼、挖化石、布置家园」。
              这里是我把知识落地的后花园。
            </p>
          </div>
        </div>
        <Divider type="line-brown" />
        <div className="about-card__stats">
          <div className="about-stat">
            <Icon name="icon-map" />
            <span>坐标：浏览器小岛</span>
          </div>
          <div className="about-stat">
            <Icon name="icon-diy" />
            <span>爱好：折腾 UI 与动森风</span>
          </div>
          <div className="about-stat">
            <Time />
            <span>小岛时间</span>
          </div>
        </div>
      </Card>

      <Divider type="wave-yellow" />

      <Title size="middle" color="app-green">
        常见问题
      </Title>
      <div className="about-faq">
        {faqs.map((item, i) => (
          <Collapse key={i} question={item.q} answer={item.a} defaultExpanded={i === 0} />
        ))}
      </div>

      <Divider type="line-brown" />

      <div className="about-cta">
        <Link to="/blog">
          <Button type="primary">去翻翻笔记 →</Button>
        </Link>
      </div>
    </div>
  );
}
