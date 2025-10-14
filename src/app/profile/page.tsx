
"use client";

import { ProfileCard } from "@/components/profile/ProfileCard";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Crown, Settings, CheckCircle, Clock, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getUserTypeDisplayName } from "@/lib/auth";
import Link from "next/link";

export default function ProfilePage() {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get('upgraded');

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading || !userProfile) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-10 w-10 animate-spin"/>
        </div>
    );
  }

  const getVerificationBadge = () => {
    if (userProfile.verified) {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verificado
        </Badge>
      );
    } else if (userProfile.verificationStatus === 'pending') {
      return (
        <Badge variant="secondary" className="bg-yellow-600">
          <Clock className="h-3 w-3 mr-1" />
          Pendiente
        </Badge>
      );
    } else if (userProfile.verificationStatus === 'rejected') {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rechazado
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {upgraded && (
        <div className="mb-6 bg-green-900/20 border border-green-500 rounded-lg p-4">
          <h3 className="font-semibold text-green-400 mb-2">
            ¡Solicitud Enviada Exitosamente!
          </h3>
          <p className="text-green-300 text-sm">
            Tu solicitud de upgrade ha sido enviada. Te notificaremos por email cuando sea revisada.
          </p>
        </div>
      )}

      {/* Información de cuenta */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-yellow-500">
                Mi Perfil
              </CardTitle>
              <CardDescription>
                Gestiona tu información y configuración de cuenta
              </CardDescription>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Información Personal</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Nombre:</strong> {userProfile.displayName}</p>
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Username:</strong> @{userProfile.username}</p>
                  {userProfile.location && (
                    <p><strong>Ubicación:</strong> {userProfile.location}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Estadísticas</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-500">{userProfile.followers}</p>
                    <p className="text-gray-400">Seguidores</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-500">{userProfile.following}</p>
                    <p className="text-gray-400">Siguiendo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tipo de cuenta */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Tipo de Cuenta</h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {getUserTypeDisplayName(userProfile.userType)}
                    </span>
                    {getVerificationBadge()}
                  </div>
                  
                  {userProfile.userType === 'fan' && (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm">
                        Acceso básico para ver contenido y comprar entradas
                      </p>
                      <Link href="/profile/upgrade">
                        <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade tu Cuenta
                        </Button>
                      </Link>
                    </div>
                  )}

                  {userProfile.userType !== 'fan' && !userProfile.verified && (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm">
                        Tu cuenta está pendiente de verificación
                      </p>
                      {userProfile.verificationStatus === 'rejected' && (
                        <Link href="/profile/upgrade">
                          <Button variant="outline" className="w-full">
                            Enviar Nueva Solicitud
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}

                  {userProfile.verified && (
                    <p className="text-green-400 text-sm">
                      ¡Tu cuenta está verificada! Tienes acceso completo a todas las funciones.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Componente de perfil existente */}
      {userProfile && (
        <ProfileCard user={userProfile as any} isCurrentUser={true} />
      )}
    </div>
  );
}

