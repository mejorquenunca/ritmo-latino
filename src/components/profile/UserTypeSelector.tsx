'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Disc3, 
  Users, 
  GraduationCap, 
  Building, 
  Calendar,
  CheckCircle 
} from 'lucide-react';
import { getUserTypeDisplayName, getUserTypeDescription } from '@/lib/auth';
import type { UserType } from '@/types/user';

interface UserTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const userTypeOptions: Array<{
  type: UserType;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
}> = [
  {
    type: 'artist',
    icon: <Music className="h-6 w-6" />,
    features: [
      'Subir música al catálogo TSón',
      'Crear y promocionar eventos',
      'Página profesional personalizada',
      'Herramientas de marketing',
      'Estadísticas detalladas'
    ],
    popular: true
  },
  {
    type: 'dj',
    icon: <Disc3 className="h-6 w-6" />,
    features: [
      'Subir sets y remixes',
      'Crear eventos y fiestas',
      'Página profesional de DJ',
      'Colaborar con artistas',
      'Promocionar presentaciones'
    ],
    popular: true
  },
  {
    type: 'dancer',
    icon: <Users className="h-6 w-6" />,
    features: [
      'Publicar videos de baile',
      'Crear clases y workshops',
      'Página de coreógrafo',
      'Colaborar con artistas',
      'Organizar competencias'
    ]
  },
  {
    type: 'school',
    icon: <GraduationCap className="h-6 w-6" />,
    features: [
      'Página institucional',
      'Publicar clases y cursos',
      'Subir contenido educativo',
      'Organizar eventos académicos',
      'Gestionar estudiantes'
    ]
  },
  {
    type: 'venue',
    icon: <Building className="h-6 w-6" />,
    features: [
      'Página de local/negocio',
      'Crear y vender eventos',
      'Promocionar servicios',
      'Gestionar calendario',
      'Estadísticas de ventas'
    ]
  },
  {
    type: 'organizer',
    icon: <Calendar className="h-6 w-6" />,
    features: [
      'Crear eventos masivos',
      'Gestión avanzada de entradas',
      'Herramientas de marketing',
      'Invitar múltiples artistas',
      'Reportes de eventos'
    ]
  }
];

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedType,
  onTypeSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {userTypeOptions.map((option) => (
        <Card 
          key={option.type}
          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
            selectedType === option.type 
              ? 'ring-2 ring-yellow-500 bg-yellow-500/10' 
              : 'hover:bg-gray-800/50'
          }`}
          onClick={() => onTypeSelect(option.type)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedType === option.type 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-700 text-yellow-500'
                }`}>
                  {option.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {getUserTypeDisplayName(option.type)}
                  </h3>
                  {option.popular && (
                    <Badge variant="secondary" className="mt-1 bg-yellow-600">
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
              {selectedType === option.type && (
                <CheckCircle className="h-5 w-5 text-yellow-500" />
              )}
            </div>

            <p className="text-gray-400 text-sm mb-4">
              {getUserTypeDescription(option.type)}
            </p>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-300">
                Funciones incluidas:
              </h4>
              <ul className="space-y-1">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-400">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};