import { Footer } from 'animal-island-ui';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <Footer type="sea" seamless />
      <div className="site-footer__text">
        <p>小岛笔记 · 一座建在浏览器里的小岛</p>
        <p className="site-footer__sub">
          Powered by React + animal-island-ui · © {year} SANIKKI
        </p>
      </div>
    </footer>
  );
}
