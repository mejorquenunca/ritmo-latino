'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { requestUserTypeChange } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { getUserTypeDisplayName } from '@/lib/auth';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import type { UserType } from '@/types/user';

const verificationSchema = z.object({
  businessName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  businessAddress: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  businessPhone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  businessWebsite: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  businessDescription: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  experience: z.string().min(10, 'Describe tu experiencia (mínimo 10 caracteres)'),
  socialLinks: z.string().optional(),
});

interface VerificationFormProps {
  requestedUserType?: UserType;
  currentUserType?: UserType;
  onSuccess: () => void;
  onCancel: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  requestedUserType,
  currentUserType,
  onSuccess,
  onCancel
}) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessWebsite: '',
      businessDescription: '',
      experience: '',
      socialLinks: '',
    },
  });

  const targetUserType = requestedUserType || currentUserType;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast({
        variant: 'destructive',
        title: 'Archivos inválidos',
        description: 'Solo se permiten imágenes (JPG, PNG) y PDFs menores a 5MB'
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof verificationSchema>) => {
    if (!userProfile || !targetUserType) return;

    if (uploadedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Documentos requeridos',
        description: 'Debes subir al menos un documento de verificación'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Aquí simularemos la subida de archivos
      // En una implementación real, subirías a Firebase Storage
      const documentUrls = uploadedFiles.map(file => `temp_url_${file.name}`);

      const businessInfo = {
        name: values.businessName,
        address: values.businessAddress,
        phone: values.businessPhone,
        website: values.businessWebsite || undefined,
        description: values.businessDescription,
      };

      await requestUserTypeChange(
        userProfile.id,
        targetUserType,
        documentUrls,
        businessInfo
      );

      toast({
        title: '¡Solicitud enviada!',
        description: 'Tu solicitud de verificación ha sido enviada. Te notificaremos por email cuando sea revisada.',
      });

      onSuccess();
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        variant: 'destructive',
        title: 'Error al enviar solicitud',
        description: 'Hubo un problema al enviar tu solicitud. Intenta nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRequiredDocuments = (userType: UserType): string[] => {
    const docs: Record<UserType, string[]> = {
      fan: [],
      artist: ['Cédula de identidad', 'Portafolio musical', 'Enlaces a redes sociales'],
      dj: ['Cédula de identidad', 'Portafolio de sets', 'Certificados o referencias'],
      dancer: ['Cédula de identidad', 'Videos de baile', 'Certificados de academias'],
      school: ['RUT de la empresa', 'Licencia de funcionamiento', 'Certificados académicos'],
      venue: ['RUT del negocio', 'Licencia comercial', 'Fotos del local'],
      organizer: ['RUT o cédula', 'Experiencia en eventos', 'Referencias comerciales']
    };
    return docs[userType] || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-yellow-500">
          Solicitud de Verificación
        </CardTitle>
        <CardDescription>
          Solicitar verificación como: <strong>{getUserTypeDisplayName(targetUserType!)}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información del negocio/actividad */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Profesional</h3>
              
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {targetUserType === 'artist' || targetUserType === 'dj' 
                        ? 'Nombre artístico' 
                        : 'Nombre del negocio/organización'}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Salsa, Academia Ritmo Latino" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Ciudad, País" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="businessWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sitio web (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://tu-sitio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción de tu actividad</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe tu trabajo, especialidad, servicios que ofreces..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experiencia y trayectoria</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Cuéntanos sobre tu experiencia, logros, años en el sector..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enlaces a redes sociales (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Instagram: @tu_usuario&#10;YouTube: youtube.com/tu_canal&#10;TikTok: @tu_tiktok"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subida de documentos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documentos de Verificación</h3>
              
              <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-400">Documentos requeridos:</h4>
                    <ul className="text-blue-300 text-sm mt-2 space-y-1">
                      {getRequiredDocuments(targetUserType!).map((doc, index) => (
                        <li key={index}>• {doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 mb-2">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Formatos: JPG, PNG, PDF (máx. 5MB cada uno)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Seleccionar Archivos
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Archivos seleccionados:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-yellow-500 text-black hover:bg-yellow-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Solicitud'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};