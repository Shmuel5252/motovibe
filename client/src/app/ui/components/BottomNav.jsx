import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/routes', label: 'Routes', icon: '🗺️' },
  { to: '/ride/active', label: 'Ride', icon: '⚡', isCenter: true },
  { to: '/rides/history', label: 'History', icon: '🧾' },
  { to: null, label: 'Bike', icon: '🏍️', disabled: true }, // placeholder until route exists
];

export default function BottomNav() {
  return (
    <nav className="mv-nav" aria-label="Bottom navigation">
      {items.map((it) => {
        const cls = ({ isActive } = {}) =>
          [
            'mv-nav__item',
            it.isCenter ? 'mv-nav__item--center' : '',
            isActive ? 'mv-nav__item--active' : '',
            it.disabled ? 'mv-nav__item--disabled' : '',
          ].filter(Boolean).join(' ');

        if (!it.to) {
          return (
            <button
              key={it.label}
              type="button"
              className={cls()}
              disabled
              aria-disabled="true"
            >
              <span className="mv-nav__icon" aria-hidden="true">{it.icon}</span>
              <span className="mv-nav__label">{it.label}</span>
            </button>
          );
        }

        return (
          <NavLink
            key={it.to}
            to={it.to}
            className={cls}
            end={it.to === '/'}
          >
            <span className="mv-nav__icon" aria-hidden="true">{it.icon}</span>
            <span className="mv-nav__label">{it.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
