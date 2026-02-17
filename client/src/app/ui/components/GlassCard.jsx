export default function GlassCard({
  className = '',
  title,
  subtitle,
  right,
  children,
  ...props
}) {
  return (
    <section className={`mv-card ${className}`} {...props}>
      {(title || subtitle || right) && (
        <header className="mv-card__header">
          <div className="mv-card__titles">
            {title && <h3 className="mv-card__title">{title}</h3>}
            {subtitle && <p className="mv-card__subtitle">{subtitle}</p>}
          </div>
          {right && <div className="mv-card__right">{right}</div>}
        </header>
      )}

      <div className="mv-card__body">{children}</div>
    </section>
  );
}
