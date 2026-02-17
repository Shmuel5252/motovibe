export default function StatStrip({ items = [], className = '' }) {
  return (
    <div className={`mv-strip ${className}`}>
      {items.map((it, idx) => (
        <div key={idx} className="mv-strip__item">
          {it.icon && <span className="mv-strip__icon">{it.icon}</span>}
          <div className="mv-strip__meta">
            <div className="mv-strip__value">{it.value}</div>
            {it.label && <div className="mv-strip__label">{it.label}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
