interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  const baseClasses = 'bg-white rounded-xl p-6 shadow-sm border border-gray-100';
  const hoverClasses = hover ? 'hover:shadow-md hover:shadow-green-100 transition-all duration-200' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
