'use client';

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface VasílalaButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'gradient';
  isLoading?: boolean;
  loadingText?: string;
  glow?: boolean;
}

export const VasílalaButton: React.FC<VasílalaButtonProps> = ({
  className,
  variant = 'primary',
  isLoading = false,
  loadingText,
  glow = false,
  children,
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-yellow-500 text-black hover:bg-yellow-400 font-semibold shadow-lg hover:shadow-xl transition-all duration-200';
      case 'secondary':
        return 'bg-gray-800 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/10 hover:border-yellow-500 font-semibold transition-all duration-200';
      case 'outline':
        return 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold transition-all duration-200';
      case 'ghost':
        return 'text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all duration-200';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200';
      case 'gradient':
        return 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-yellow-500 border border-yellow-500/30 hover:border-yellow-500/60 hover:from-yellow-500/10 hover:via-yellow-500/5 hover:to-yellow-500/10 font-semibold transition-all duration-300';
      default:
        return '';
    }
  };

  const glowClasses = glow ? 'shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]' : '';

  return (
    <Button
      className={cn(
        getVariantClasses(),
        glowClasses,
        isLoading && 'opacity-70 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText || 'Cargando...'}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};