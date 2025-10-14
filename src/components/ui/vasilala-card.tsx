'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface VasílalaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient' | 'glass';
  glow?: boolean;
  hover?: boolean;
}

export const VasílalaCard: React.FC<VasílalaCardProps> = ({
  className,
  variant = 'default',
  glow = false,
  hover = true,
  children,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-gray-800/90 border-gray-700 shadow-2xl backdrop-blur-sm';
      case 'bordered':
        return 'bg-gray-800/50 border-2 border-yellow-500/30 hover:border-yellow-500/60';
      case 'gradient':
        return 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-yellow-500/20';
      case 'glass':
        return 'bg-gray-900/30 backdrop-blur-md border-gray-700/50 shadow-xl';
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-lg transition-all duration-300' : '';
  const glowClasses = glow ? 'shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]' : '';

  return (
    <Card
      className={cn(
        getVariantClasses(),
        hoverClasses,
        glowClasses,
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

// Componentes específicos con estilos de Vasílala
export const VasílalaCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <CardHeader className={cn('border-b border-gray-700/50', className)} {...props}>
    {children}
  </CardHeader>
);

export const VasílalaCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <CardTitle className={cn('text-yellow-500 text-xl font-bold', className)} {...props}>
    {children}
  </CardTitle>
);

export const VasílalaCardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <CardDescription className={cn('text-gray-400', className)} {...props}>
    {children}
  </CardDescription>
);

export const VasílalaCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <CardContent className={cn('text-gray-300', className)} {...props}>
    {children}
  </CardContent>
);

export const VasílalaCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <CardFooter className={cn('border-t border-gray-700/50 bg-gray-800/30', className)} {...props}>
    {children}
  </CardFooter>
);