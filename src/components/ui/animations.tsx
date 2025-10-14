'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Componente de animación de entrada
export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  direction = 'up',
  className
}) => {
  const getDirectionClasses = () => {
    switch (direction) {
      case 'up':
        return 'animate-in slide-in-from-bottom-4 fade-in';
      case 'down':
        return 'animate-in slide-in-from-top-4 fade-in';
      case 'left':
        return 'animate-in slide-in-from-right-4 fade-in';
      case 'right':
        return 'animate-in slide-in-from-left-4 fade-in';
      default:
        return 'animate-in fade-in';
    }
  };

  return (
    <div
      className={cn(
        getDirectionClasses(),
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

// Componente de pulso dorado
export const GoldenPulse: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('animate-pulse', className)}>
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-500/30 to-yellow-600/20 rounded-lg blur-sm"></div>
    <div className="relative">{children}</div>
  </div>
);

// Componente de brillo dorado
export const GoldenGlow: React.FC<{ 
  children: React.ReactNode; 
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}> = ({
  children,
  intensity = 'medium',
  className
}) => {
  const getIntensityClasses = () => {
    switch (intensity) {
      case 'low':
        return 'shadow-[0_0_10px_rgba(212,175,55,0.2)]';
      case 'high':
        return 'shadow-[0_0_30px_rgba(212,175,55,0.6)]';
      default:
        return 'shadow-[0_0_20px_rgba(212,175,55,0.4)]';
    }
  };

  return (
    <div className={cn(getIntensityClasses(), 'transition-all duration-300', className)}>
      {children}
    </div>
  );
};

// Componente de hover con efecto dorado
export const GoldenHover: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  scale?: boolean;
}> = ({
  children,
  className,
  scale = true
}) => (
  <div 
    className={cn(
      'transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]',
      scale && 'hover:scale-105',
      'cursor-pointer',
      className
    )}
  >
    {children}
  </div>
);

// Componente de loading con estilo Vasílala
export const VasílalaLoader: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}> = ({
  size = 'md',
  text,
  className
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-8 w-8';
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-3', className)}>
      <div className="relative">
        <div className={cn(
          'animate-spin rounded-full border-2 border-gray-700',
          getSizeClasses()
        )}>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-yellow-500 animate-spin"></div>
        </div>
        <div className="absolute inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-20 animate-pulse"></div>
      </div>
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Componente de skeleton con estilo Vasílala
export const VasílalaSkeleton: React.FC<{
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}> = ({
  className,
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full aspect-square';
      default:
        return 'rounded-lg';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'wave':
        return 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-[wave_1.5s_ease-in-out_infinite]';
      default:
        return 'bg-gray-800 animate-pulse';
    }
  };

  return (
    <div 
      className={cn(
        getVariantClasses(),
        getAnimationClasses(),
        className
      )}
    />
  );
};

// Componente de partículas doradas (decorativo)
export const GoldenParticles: React.FC<{ 
  count?: number;
  className?: string;
}> = ({
  count = 20,
  className
}) => (
  <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-yellow-500 rounded-full opacity-60 animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

// Componente de texto con efecto de escritura
export const TypewriterText: React.FC<{
  text: string;
  speed?: number;
  className?: string;
  onCompleteAction?: () => void;
}> = ({
  text,
  speed = 100,
  className,
  onCompleteAction
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onCompleteAction) {
      onCompleteAction();
    }
  }, [currentIndex, text, speed, onCompleteAction]);

  return (
    <span className={cn('inline-block', className)}>
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
};