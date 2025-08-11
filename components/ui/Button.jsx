export default function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-300',
    subtle: 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-300'
  };
  const v = variants[variant] || variants.primary;
  return (
    <button onClick={onClick} className={`${base} ${v} ${className}`} {...props}>
      {children}
    </button>
  );
}
