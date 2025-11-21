interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  href,
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-violet-500 text-white hover:bg-violet-600 focus:ring-violet-500',
    secondary: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500',
    accent: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Las clases personalizadas tienen prioridad sobre las variantes
  const hasCustomStyles = className && (className.includes('bg-') || className.includes('border-'))
  const variantClasses = hasCustomStyles ? '' : variants[variant]
  const classes = `${baseClasses} ${variantClasses} ${sizes[size]} ${className || ''}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
