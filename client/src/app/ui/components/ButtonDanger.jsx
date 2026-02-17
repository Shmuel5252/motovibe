export default function ButtonDanger({
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`mv-btn mv-btn--danger ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
