'use client';

import React from 'react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, Crown, Shield, Star, Zap } from 'lucide-react';

export interface VasílalaBadgeProps extends Omit<BadgeProps, 'variant'> {
  variant?: 'default' | 'gold' | 'verified' | 'pending' | 'rejected' | 'premium' | 'admin' | 'featured' | 'trending';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  icon?: boolean;
}

export const VasílalaBadge: React.FC<VasílalaBadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  glow = false,
  icon = true,
  children,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold border-0';
      case 'verified':
        return 'bg-green-600 text-white border-green-500';
      case 'pending':
        return 'bg-yellow-600 text-black border-yellow-500';
      case 'rejected':
        return 'bg-red-600 text-white border-red-500';
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 font-semibold';
      case 'admin':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 font-semibold';
      case 'featured':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 font-semibold';
      case 'trending':
        return 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 font-semibold animate-pulse';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5 h-5';
      case 'lg':
        return 'text-sm px-3 py-1 h-7';
      default:
        return 'text-xs px-2.5 py-0.5 h-6';
    }
  };

  const getIcon = () => {
    if (!icon) return null;
    
    const iconClass = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';
    
    switch (variant) {
      case 'verified':
        return <CheckCircle className={iconClass} />;
      case 'pending':
        return <Clock className={iconClass} />;
      case 'rejected':
        return <XCircle className={iconClass} />;
      case 'premium':
      case 'gold':
        return <Crown className={iconClass} />;
      case 'admin':
        return <Shield className={iconClass} />;
      case 'featured':
        return <Star className={iconClass} />;
      case 'trending':
        return <Zap className={iconClass} />;
      default:
        return null;
    }
  };

  const glowClasses = glow ? 'shadow-[0_0_15px_rgba(212,175,55,0.4)]' : '';

  return (
    <Badge
      className={cn(
        getVariantClasses(),
        getSizeClasses(),
        glowClasses,
        'inline-flex items-center space-x-1 transition-all duration-200',
        className
      )}
      {...props}
    >
      {getIcon()}
      <span>{children}</span>
    </Badge>
  );
};

// Badges específicos para tipos de usuario
export const UserTypeBadge: React.FC<{ userType: string; verified?: boolean }> = ({ 
  userType, 
  verified = false 
}) => {
  const getVariantForUserType = () => {
    if (userType === 'fan') return verified ? 'verified' : 'default';
    return verified ? 'gold' : 'pending';
  };

  const getDisplayName = () => {
    const names = {
      fan: 'Fan',
      artist: 'Artista',
      dj: 'DJ',
      dancer: 'Bailarín',
      school: 'Escuela',
      venue: 'Local',
      organizer: 'Organizador'
    };
    return names[userType as keyof typeof names] || userType;
  };

  return (
    <VasílalaBadge variant={getVariantForUserType()}>
      {getDisplayName()}
    </VasílalaBadge>
  );
};

// Badge de verificación
export const VerificationBadge: React.FC<{ status: 'verified' | 'pending' | 'rejected' }> = ({ 
  status 
}) => {
  const labels = {
    verified: 'Verificado',
    pending: 'Pendiente',
    rejected: 'Rechazado'
  };

  return (
    <VasílalaBadge variant={status}>
      {labels[status]}
    </VasílalaBadge>
  );
};