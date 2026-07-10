import { NavLink } from 'react-router-dom';
import { Cursor, Icon } from 'animal-island-ui';

const navItems = [
  { to: '/blog', label: '首页', icon: 'icon-map', end: true },
  { to: '/blog/tags', label: '标签', icon: 'icon-variant', end: true },
  { to: '/blog/tags/Agent', label: 'Agent', icon: 'icon-critterpedia', end: false },
  { to: '/blog/about', label: '关于', icon: 'icon-chat', end: false },
] as const;

export function Header() {
  return (
    <Cursor>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="site-logo">
            <span className="site-logo__leaf" />
            <span className="site-logo__text">小岛笔记</span>
          </NavLink>
          <nav className="site-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  'site-nav__link' + (isActive ? ' is-active' : '')
                }
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    </Cursor>
  );
}
