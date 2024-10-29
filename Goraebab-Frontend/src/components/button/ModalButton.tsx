import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
}: ButtonProps) => {
  const baseStyles =
    'font-semibold font-pretendard rounded-lg transition-all duration-200 flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-blue_6 text-white hover:bg-blue_5',
    secondary: 'bg-grey_4 text-grey_7 hover:bg-grey_3 active:bg-gret_4',
    outline:
      'bg-transparent border-2 border-blue_6 text-blue_6 hover:bg-blue-50 active:bg-blue_1',
    ghost: 'bg-transparent text-blue_6 hover:bg-blue-50 active:bg-blue_1',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const computedClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button
      className={computedClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          로딩중...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
