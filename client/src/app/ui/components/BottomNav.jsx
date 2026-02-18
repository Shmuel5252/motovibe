import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/routes", label: "Routes", icon: "🗺️" },
  { to: "/ride/active", label: "Ride", icon: "⚡", isCenter: true },
  { to: "/rides/history", label: "History", icon: "🧾" },
  { to: "/bike", label: "Bike", icon: "🏍️" }, // exists in UI, disabled for now
];

export default function BottomNav() {
  return (
    <nav className="mv-nav" aria-label="Bottom navigation">
      {items.map((it) => {
        const isBike = it.to === "/bike"; // disabled until route exists

        if (isBike) {
          return (
            <span
              key={it.to}
              className={[
                "mv-nav__item",
                it.isCenter ? "mv-nav__item--center" : "",
                "mv-nav__item--disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-disabled="true"
              title="Coming soon"
            >
              <span className="mv-nav__icon" aria-hidden="true">
                {it.icon}
              </span>
              <span className="mv-nav__label">{it.label}</span>
            </span>
          );
        }

        return (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === "/"}
            className={({ isActive }) =>
              [
                "mv-nav__item",
                it.isCenter ? "mv-nav__item--center" : "",
                isActive ? "mv-nav__item--active" : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            <span className="mv-nav__icon" aria-hidden="true">
              {it.icon}
            </span>
            <span className="mv-nav__label">{it.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
