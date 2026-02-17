export default function ButtonPrimary({
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`mv-btn mv-btn--primary ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
