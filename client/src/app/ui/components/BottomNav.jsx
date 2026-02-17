import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/routes', label: 'Routes', icon: '🗺️' },
  { to: '/ride/active', label: 'Ride', icon: '⚡', isCenter: true },
  { to: '/rides/history', label: 'History', icon: '🧾' },
  { to: '/bike', label: 'Bike', icon: '🏍️' },
];

export default function BottomNav() {
  return (
    <nav className="mv-nav" aria-label="Bottom navigation">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) =>
            [
              'mv-nav__item',
              it.isCenter ? 'mv-nav__item--center' : '',
              isActive ? 'mv-nav__item--active' : '',
            ].filter(Boolean).join(' ')
          }
          end={it.to === '/'}
        >
          <span className="mv-nav__icon" aria-hidden="true">{it.icon}</span>
          <span className="mv-nav__label">{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
