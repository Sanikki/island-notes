import type { ReactNode } from 'react';
import { Header } from './Header';
import { SiteFooter } from './SiteFooter';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <Header />
      <main className="site-main">
        <div className="site-container">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
