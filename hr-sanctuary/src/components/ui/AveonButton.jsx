export default function AveonButton({
  children,
  className = '',
  variant = 'primary',
  onClick,
  disabled,
  type = 'button',
  as: Component = 'button',
  to,
  showArrow = true,
  ...props
}) {
  const base = 'aveon-btn group inline-flex items-center justify-center gap-2'
  const variants = {
    primary: 'aveon-btn-primary',
    outline: 'aveon-btn-outline',
    ghost: 'aveon-btn-ghost',
  }

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`
  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <span className="aveon-btn-arrow material-symbols-outlined text-sm">arrow_forward</span>
      )}
    </>
  )

  if (Component !== 'button') {
    return (
      <Component className={classes} to={to} {...props}>
        {content}
      </Component>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...props}>
      {content}
    </button>
  )
}
