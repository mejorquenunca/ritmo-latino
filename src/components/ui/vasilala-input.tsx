'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Search, AlertCircle, CheckCircle } from 'lucide-react';

export interface VasílalaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'search' | 'bordered' | 'glass';
  glow?: boolean;
}

export const VasílalaInput: React.FC<VasílalaInputProps> = ({
  className,
  label,
  error,
  success,
  hint,
  icon,
  variant = 'default',
  glow = false,
  type,
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  const getVariantClasses = () => {
    switch (variant) {
      case 'search':
        return 'bg-gray-800 border-gray-700 focus:border-yellow-500 focus:ring-yellow-500/20 pl-10';
      case 'bordered':
        return 'bg-gray-800/50 border-2 border-yellow-500/30 focus:border-yellow-500 focus:ring-yellow-500/20';
      case 'glass':
        return 'bg-gray-900/30 backdrop-blur-md border-gray-700/50 focus:border-yellow-500/60 focus:ring-yellow-500/10';
      default:
        return 'bg-gray-800 border-gray-700 focus:border-yellow-500 focus:ring-yellow-500/20';
    }
  };

  const glowClasses = glow && isFocused ? 'shadow-[0_0_20px_rgba(212,175,55,0.3)]' : '';
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';
  const successClasses = success ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : '';

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={inputId} 
          className="text-sm font-medium text-gray-300"
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        {/* Icono izquierdo */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {/* Icono de búsqueda para variant search */}
        {variant === 'search' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
        )}

        <Input
          id={inputId}
          type={actualType}
          className={cn(
            getVariantClasses(),
            glowClasses,
            errorClasses,
            successClasses,
            icon && 'pl-10',
            isPassword && 'pr-10',
            'transition-all duration-200',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Botón para mostrar/ocultar contraseña */}
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Icono de estado */}
        {(error || success) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error && <AlertCircle className="h-4 w-4 text-red-500" />}
            {success && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
        )}
      </div>

      {/* Mensajes de estado */}
      {error && (
        <p className="text-sm text-red-500 flex items-center space-x-1">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </p>
      )}
      
      {success && (
        <p className="text-sm text-green-500 flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" />
          <span>{success}</span>
        </p>
      )}
      
      {hint && !error && !success && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
};

// Componente específico para búsqueda
export const VasílalaSearchInput: React.FC<Omit<VasílalaInputProps, 'variant'>> = (props) => (
  <VasílalaInput variant="search" {...props} />
);