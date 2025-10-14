'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  User,
  Calendar,
  Phone,
  Globe,
  MapPin
} from 'lucide-react';
import { getUserTypeDisplayName } from '@/lib/auth';
import type { VerificationRequest } from '@/types/user';

// Datos de ejemplo para demostración
const mockVerificationRequests: VerificationRequest[] = [
  {
    id: '1',
    userId: 'user1',
    requestedUserType: 'artist',
    documents: ['cedula.pdf', 'portfolio.pdf'],
    businessInfo: {
      name: 'Juan Salsa',
      address: 'Medellín, Colombia',
      phone: '+57 300 123 4567',
      website: 'https://juansalsa.com',
      description: 'Artista de salsa con 10 años de experiencia'
    },
    status: 'pending',
    submittedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: 'user2',
    requestedUserType: 'venue',
    documents: ['rut.pdf', 'licencia.pdf', 'fotos_local.pdf'],
    businessInfo: {
      name: 'Salsódromo La Clave',
      address: 'Cali, Colombia',
      phone: '+57 2 555 0123',
      description: 'Local especializado en música latina con capacidad para 200 personas'
    },
    status: 'pending',
    submittedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    userId: 'user3',
    requestedUserType: 'dj',
    documents: ['cedula.pdf', 'sets_portfolio.pdf'],
    businessInfo: {
      name: 'DJ Latino Mix',
      address: 'Bogotá, Colombia',
      phone: '+57 1 444 5678',
      description: 'DJ especializado en reggaeton y salsa moderna'
    },
    status: 'approved',
    submittedAt: new Date('2024-01-10'),
    reviewedAt: new Date('2024-01-12'),
    reviewedBy: 'admin1'
  }
];

export default function VerificationsPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>(mockVerificationRequests);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  const handleApprove = async (requestId: string) => {
    // Aquí implementarías la lógica para aprobar la solicitud
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved', reviewedAt: new Date(), reviewedBy: 'current_admin' }
        : req
    ));
    setSelectedRequest(null);
  };

  const handleReject = async (requestId: string, reason: string) => {
    // Aquí implementarías la lógica para rechazar la solicitud
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected', reviewedAt: new Date(), reviewedBy: 'current_admin', rejectionReason: reason }
        : req
    ));
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: VerificationRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rechazado</Badge>;
    }
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  return (
    <ProtectedRoute requiredUserType={['organizer']} fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Acceso Restringido</h2>
          <p className="text-gray-400">Solo los administradores pueden acceder a esta página.</p>
        </div>
      </div>
    }>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">
            Panel de Verificaciones
          </h1>
          <p className="text-gray-400">
            Gestiona las solicitudes de verificación de usuarios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de solicitudes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Verificación</CardTitle>
                <CardDescription>
                  Revisa y gestiona las solicitudes pendientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pending">Pendientes</TabsTrigger>
                    <TabsTrigger value="approved">Aprobadas</TabsTrigger>
                    <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
                    <TabsTrigger value="all">Todas</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-6">
                    <div className="space-y-4">
                      {filteredRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          No hay solicitudes en esta categoría
                        </div>
                      ) : (
                        filteredRequests.map((request) => (
                          <div
                            key={request.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedRequest?.id === request.id
                                ? 'border-yellow-500 bg-yellow-500/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedRequest(request)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="font-semibold">
                                    {request.businessInfo?.name}
                                  </span>
                                  {getStatusBadge(request.status)}
                                </div>
                                <p className="text-sm text-gray-400 mb-1">
                                  Solicita ser: <strong>{getUserTypeDisplayName(request.requestedUserType)}</strong>
                                </p>
                                <p className="text-xs text-gray-500">
                                  Enviado: {request.submittedAt.toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRequest(request);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Detalles de la solicitud seleccionada */}
          <div className="lg:col-span-1">
            {selectedRequest ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detalles de Solicitud</CardTitle>
                  <CardDescription>
                    {getUserTypeDisplayName(selectedRequest.requestedUserType)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Información del Negocio</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{selectedRequest.businessInfo?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedRequest.businessInfo?.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedRequest.businessInfo?.phone}</span>
                      </div>
                      {selectedRequest.businessInfo?.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <a 
                            href={selectedRequest.businessInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500 hover:underline"
                          >
                            Sitio web
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Descripción</h4>
                    <p className="text-sm text-gray-400">
                      {selectedRequest.businessInfo?.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Documentos</h4>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Estado</h4>
                    <div className="space-y-2">
                      {getStatusBadge(selectedRequest.status)}
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Enviado: {selectedRequest.submittedAt.toLocaleDateString()}</span>
                        </div>
                        {selectedRequest.reviewedAt && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>Revisado: {selectedRequest.reviewedAt.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedRequest.status === 'pending' && (
                    <div className="space-y-2 pt-4">
                      <Button
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar Solicitud
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedRequest.id, 'Documentación insuficiente')}
                        variant="destructive"
                        className="w-full"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar Solicitud
                      </Button>
                    </div>
                  )}

                  {selectedRequest.rejectionReason && (
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
                      <h4 className="font-semibold text-red-400 text-sm mb-1">
                        Motivo del rechazo:
                      </h4>
                      <p className="text-red-300 text-xs">
                        {selectedRequest.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-400">
                    <Eye className="h-8 w-8 mx-auto mb-2" />
                    <p>Selecciona una solicitud para ver los detalles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}