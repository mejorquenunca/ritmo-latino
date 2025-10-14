'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { UserTypeSelector } from '@/components/profile/UserTypeSelector';
import { VerificationForm } from '@/components/profile/VerificationForm';
import { getUserTypeDisplayName, getUserTypeDescription } from '@/lib/auth';

export default function UpgradePage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    router.push('/login');
    return null;
  }

  // Si el usuario ya no es Fan, mostrar estado actual
  if (userProfile.userType !== 'fan') {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 text-yellow-500 hover:text-yellow-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-500">
              Estado de tu Cuenta
            </CardTitle>
            <CardDescription>
              Información sobre tu tipo de cuenta actual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-lg">
                  {getUserTypeDisplayName(userProfile.userType)}
                </h3>
                <p className="text-gray-400 text-sm">
                  {getUserTypeDescription(userProfile.userType)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {userProfile.verified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="default" className="bg-green-600">
                      Verificado
                    </Badge>
                  </>
                ) : userProfile.verificationStatus === 'pending' ? (
                  <>
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <Badge variant="secondary" className="bg-yellow-600">
                      Pendiente
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <Badge variant="destructive">
                      No Verificado
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {!userProfile.verified && userProfile.verificationStatus === 'pending' && (
              <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">
                  Solicitud en Revisión
                </h4>
                <p className="text-blue-300 text-sm">
                  Tu solicitud de verificación está siendo revisada por nuestro equipo. 
                  Te notificaremos por email cuando tengamos una respuesta.
                </p>
              </div>
            )}

            {!userProfile.verified && userProfile.verificationStatus === 'rejected' && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">
                  Solicitud Rechazada
                </h4>
                <p className="text-red-300 text-sm">
                  Tu solicitud de verificación fue rechazada. Puedes enviar una nueva 
                  solicitud con documentación adicional.
                </p>
                <Button 
                  className="mt-3" 
                  variant="outline"
                  onClick={() => setShowForm(true)}
                >
                  Enviar Nueva Solicitud
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {showForm && (
          <div className="mt-6">
            <VerificationForm 
              currentUserType={userProfile.userType}
              onSuccess={() => {
                setShowForm(false);
                router.refresh();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    );
  }

  // Si es Fan, mostrar opciones de upgrade
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 text-yellow-500 hover:text-yellow-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-yellow-500">
            Upgrade tu Cuenta
          </CardTitle>
          <CardDescription>
            Solicita cambiar tu tipo de cuenta para acceder a funciones avanzadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <div className="space-y-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Tu cuenta actual:</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Fan</p>
                    <p className="text-gray-400 text-sm">
                      Acceso básico para ver contenido y comprar entradas
                    </p>
                  </div>
                  <Badge variant="secondary">Actual</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Selecciona el tipo de cuenta que necesitas:
                </h3>
                <UserTypeSelector 
                  selectedType={selectedUserType}
                  onTypeSelect={setSelectedUserType}
                />
              </div>

              {selectedUserType && (
                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedUserType('')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-yellow-500 text-black hover:bg-yellow-400"
                  >
                    Continuar con Solicitud
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <VerificationForm 
              requestedUserType={selectedUserType as any}
              onSuccess={() => {
                router.push('/profile?upgraded=true');
              }}
              onCancel={() => {
                setShowForm(false);
                setSelectedUserType('');
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}