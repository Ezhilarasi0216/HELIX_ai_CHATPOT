import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
   size?: 'sm' | 'md' | 'lg';
   isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
   children,
   variant = 'primary',
   size = 'md',
   isLoading,
   className = '',
   ...props
}) => {
   const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

   const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5',
      secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200 shadow-sm hover:shadow',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-200',
   };

   const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
   };

   return (
      <button
         className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
         disabled={isLoading || props.disabled}
         {...props}
      >
         {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
         ) : null}
         {children}
      </button>
   );
};
