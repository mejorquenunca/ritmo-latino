'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { VasílalaButton } from '@/components/ui/vasilala-button';
import { VasílalaInput } from '@/components/ui/vasilala-input';
import { VasílalaCard, VasílalaCardContent, VasílalaCardHeader, VasílalaCardTitle } from '@/components/ui/vasilala-card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { uploadMusicTrack } from '@/lib/music';
import type { MusicUploadData } from '@/types/music';
import { 
  Upload, 
  Music, 
  Image, 
  X, 
  Play, 
  Pause,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SUPPORTED_AUDIO_FORMATS = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg'];
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const MUSIC_GENRES = [
  'Salsa', 'Bachata', 'Merengue', 'Reggaeton', 'Cumbia', 'Vallenato',
  'Tango', 'Bolero', 'Son', 'Mambo', 'Cha-cha-cha', 'Rumba',
  'Bossa Nova', 'Samba', 'Forró', 'Axé', 'Pagode', 'Sertanejo',
  'Pop Latino', 'Rock Latino', 'Balada', 'Tropical', 'Urbano', 'Otro'
];

const MUSIC_KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

interface AudioFile {
  file: File;
  url: string;
  duration: number;
  size: number;
}

interface CoverFile {
  file: File;
  url: string;
}

export const MusicUploader: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [coverFile, setCoverFile] = useState<CoverFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<Omit<MusicUploadData, 'audioFile' | 'coverFile'>>({
    title: '',
    artist: '',
    album: '',
    genre: [],
    bpm: undefined,
    key: undefined,
    year: new Date().getFullYear(),
    language: 'es',
    isOriginal: true,
    licenseType: 'original',
    hasPermission: true,
    isExplicit: false,
    allowDownloads: true,
    allowRemixes: true
  });

  const validateAudioFile = (file: File): string | null => {
    if (!SUPPORTED_AUDIO_FORMATS.includes(file.type)) {
      return 'Formato de audio no soportado. Usa MP3, WAV, FLAC, AAC u OGG.';
    }
    
    if (file.size > MAX_AUDIO_SIZE) {
      return 'El archivo de audio no puede ser mayor a 50MB';
    }
    
    return null;
  };

  const validateImageFile = (file: File): string | null => {
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      return 'Formato de imagen no soportado. Usa JPG, PNG o WebP.';
    }
    
    if (file.size > MAX_IMAGE_SIZE) {
      return 'La imagen no puede ser mayor a 5MB';
    }
    
    return null;
  };

  const processAudioFile = (file: File): Promise<AudioFile> => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement('audio');
      const url = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        // Verificar duración (máximo 10 minutos)
        if (audio.duration > 600) {
          URL.revokeObjectURL(url);
          reject(new Error('La canción no puede durar más de 10 minutos'));
          return;
        }
        
        resolve({
          file,
          url,
          duration: audio.duration,
          size: file.size
        });
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Error al procesar el archivo de audio'));
      };
      
      audio.src = url;
    });
  };

  const handleAudioSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validationError = validateAudioFile(file);
    
    if (validationError) {
      toast({
        variant: 'destructive',
        title: 'Archivo inválido',
        description: validationError
      });
      return;
    }
    
    try {
      const audioFile = await processAudioFile(file);
      setAudioFile(audioFile);
      
      // Auto-completar título si está vacío
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, title: fileName }));
      }
      
      toast({
        title: 'Audio cargado',
        description: 'Tu archivo de audio está listo para ser publicado'
      });
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al procesar audio',
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }, [formData.title, toast]);

  const handleCoverSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validationError = validateImageFile(file);
    
    if (validationError) {
      toast({
        variant: 'destructive',
        title: 'Imagen inválida',
        description: validationError
      });
      return;
    }
    
    const url = URL.createObjectURL(file);
    setCoverFile({ file, url });
    
    toast({
      title: 'Portada cargada',
      description: 'La portada de tu canción ha sido cargada'
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent, type: 'audio' | 'cover') => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (type === 'audio') {
        handleAudioSelect(e.dataTransfer.files);
      } else {
        handleCoverSelect(e.dataTransfer.files);
      }
    }
  }, [handleAudioSelect, handleCoverSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile || !userProfile) return;
    
    if (!formData.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Título requerido',
        description: 'Agrega un título a tu canción'
      });
      return;
    }
    
    if (formData.genre.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Género requerido',
        description: 'Selecciona al menos un género musical'
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadData: MusicUploadData = {
        ...formData,
        audioFile: audioFile.file,
        coverFile: coverFile?.file,
        artist: formData.artist || userProfile.displayName
      };
      
      const trackId = await uploadMusicTrack(
        uploadData,
        userProfile.id,
        (progress) => setUploadProgress(progress)
      );
      
      toast({
        title: '¡Canción publicada!',
        description: 'Tu música ha sido subida exitosamente a TSón'
      });
      
      // Reset form
      setTimeout(() => {
        if (audioFile) {
          URL.revokeObjectURL(audioFile.url);
        }
        if (coverFile) {
          URL.revokeObjectURL(coverFile.url);
        }
        
        setAudioFile(null);
        setCoverFile(null);
        setFormData({
          title: '',
          artist: '',
          album: '',
          genre: [],
          bpm: undefined,
          key: undefined,
          year: new Date().getFullYear(),
          language: 'es',
          isOriginal: true,
          licenseType: 'original',
          hasPermission: true,
          isExplicit: false,
          allowDownloads: true,
          allowRemixes: true
        });
        setUploadProgress(0);
        setIsUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading music:', error);
      toast({
        variant: 'destructive',
        title: 'Error al subir música',
        description: 'Hubo un problema al subir tu canción. Intenta nuevamente.'
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeAudio = () => {
    if (audioFile) {
      URL.revokeObjectURL(audioFile.url);
      setAudioFile(null);
    }
  };

  const removeCover = () => {
    if (coverFile) {
      URL.revokeObjectURL(coverFile.url);
      setCoverFile(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <VasílalaCard>
        <VasílalaCardHeader>
          <VasílalaCardTitle>Subir Música a TSón</VasílalaCardTitle>
        </VasílalaCardHeader>
        <VasílalaCardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Audio Upload */}
            {!audioFile ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragActive 
                    ? "border-yellow-500 bg-yellow-500/10" 
                    : "border-gray-600 hover:border-gray-500"
                )}
                onDrop={(e) => handleDrop(e, 'audio')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleAudioSelect(e.target.files)}
                  className="hidden"
                />
                
                <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Arrastra tu archivo de audio aquí
                </h3>
                <p className="text-gray-400 mb-4">
                  O haz clic para seleccionar un archivo
                </p>
                
                <VasílalaButton
                  type="button"
                  variant="primary"
                  onClick={() => audioInputRef.current?.click()}
                >
                  Seleccionar Audio
                </VasílalaButton>
                
                <div className="mt-4 text-xs text-gray-500">
                  <p>Formatos soportados: MP3, WAV, FLAC, AAC, OGG</p>
                  <p>Tamaño máximo: 50MB • Duración máxima: 10 minutos</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Audio Preview */}
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Audio Preview</h3>
                      <button
                        type="button"
                        onClick={removeAudio}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <audio
                      ref={audioRef}
                      src={audioFile.url}
                      onEnded={() => setIsPlaying(false)}
                    />
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <VasílalaButton
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={togglePlayPause}
                        className="rounded-full w-12 h-12 p-0"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </VasílalaButton>
                      
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">
                          {audioFile.file.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {formatDuration(audioFile.duration)} • {formatFileSize(audioFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cover Upload */}
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
                      "border-gray-600 hover:border-gray-500"
                    )}
                    onDrop={(e) => handleDrop(e, 'cover')}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCoverSelect(e.target.files)}
                      className="hidden"
                    />
                    
                    {coverFile ? (
                      <div className="relative">
                        <img
                          src={coverFile.url}
                          alt="Cover preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                        />
                        <button
                          type="button"
                          onClick={removeCover}
                          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="text-sm text-gray-400">Portada cargada</p>
                      </div>
                    ) : (
                      <>
                        <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 mb-2">
                          Portada (opcional)
                        </p>
                        <VasílalaButton
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => coverInputRef.current?.click()}
                        >
                          Seleccionar Imagen
                        </VasílalaButton>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Metadata Form */}
                <div className="space-y-4">
                  <VasílalaInput
                    label="Título *"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nombre de la canción"
                    maxLength={100}
                  />
                  
                  <VasílalaInput
                    label="Artista"
                    value={formData.artist}
                    onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                    placeholder={userProfile?.displayName || "Nombre del artista"}
                    maxLength={100}
                  />
                  
                  <VasílalaInput
                    label="Álbum"
                    value={formData.album}
                    onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                    placeholder="Nombre del álbum (opcional)"
                    maxLength={100}
                  />
                  
                  {/* Géneros */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Géneros *
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {MUSIC_GENRES.map((genre) => (
                        <Badge
                          key={genre}
                          variant={formData.genre.includes(genre) ? "default" : "secondary"}
                          className={cn(
                            "cursor-pointer transition-colors",
                            formData.genre.includes(genre)
                              ? "bg-yellow-500 text-black hover:bg-yellow-400"
                              : "hover:bg-gray-600"
                          )}
                          onClick={() => handleGenreToggle(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Metadatos adicionales */}
                  <div className="grid grid-cols-2 gap-4">
                    <VasílalaInput
                      label="BPM"
                      type="number"
                      value={formData.bpm || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        bpm: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      placeholder="120"
                      min={60}
                      max={200}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tonalidad
                      </label>
                      <select
                        value={formData.key || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          key: e.target.value || undefined 
                        }))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                      >
                        <option value="">Seleccionar</option>
                        {MUSIC_KEYS.map(key => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <VasílalaInput
                      label="Año"
                      type="number"
                      value={formData.year || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        year: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      placeholder="2024"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Idioma
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          language: e.target.value as 'es' | 'en' | 'pt' | 'other'
                        }))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                      >
                        <option value="es">Español</option>
                        <option value="en">Inglés</option>
                        <option value="pt">Portugués</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Licencia */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">Información de Licencia</h4>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isOriginal"
                        checked={formData.isOriginal}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          isOriginal: e.target.checked,
                          licenseType: e.target.checked ? 'original' : 'cover'
                        }))}
                        className="rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                      />
                      <label htmlFor="isOriginal" className="text-sm text-gray-300">
                        Esta es una composición original
                      </label>
                    </div>
                    
                    {!formData.isOriginal && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tipo de licencia
                        </label>
                        <select
                          value={formData.licenseType}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            licenseType: e.target.value as 'original' | 'cover' | 'remix' | 'sample'
                          }))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                        >
                          <option value="cover">Cover</option>
                          <option value="remix">Remix</option>
                          <option value="sample">Sample</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasPermission"
                        checked={formData.hasPermission}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          hasPermission: e.target.checked 
                        }))}
                        className="rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                      />
                      <label htmlFor="hasPermission" className="text-sm text-gray-300">
                        Tengo los derechos para publicar esta música
                      </label>
                    </div>
                  </div>
                  
                  {/* Configuraciones */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">Configuraciones</h4>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isExplicit"
                        checked={formData.isExplicit}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          isExplicit: e.target.checked 
                        }))}
                        className="rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                      />
                      <label htmlFor="isExplicit" className="text-sm text-gray-300">
                        Contenido explícito
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allowDownloads"
                        checked={formData.allowDownloads}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          allowDownloads: e.target.checked 
                        }))}
                        className="rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                      />
                      <label htmlFor="allowDownloads" className="text-sm text-gray-300">
                        Permitir descargas
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allowRemixes"
                        checked={formData.allowRemixes}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          allowRemixes: e.target.checked 
                        }))}
                        className="rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                      />
                      <label htmlFor="allowRemixes" className="text-sm text-gray-300">
                        Permitir remixes
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {uploadProgress === 100 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500" />
                  )}
                  <span className="text-sm text-gray-300">
                    {uploadProgress === 100 ? '¡Música publicada exitosamente!' : 'Subiendo música...'}
                  </span>
                </div>
                
                {uploadProgress < 100 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}
            
            {/* Submit Button */}
            {audioFile && !isUploading && (
              <div className="flex justify-end space-x-4">
                <VasílalaButton
                  type="button"
                  variant="secondary"
                  onClick={removeAudio}
                >
                  Cancelar
                </VasílalaButton>
                <VasílalaButton
                  type="submit"
                  variant="primary"
                  disabled={!formData.title.trim() || formData.genre.length === 0 || !formData.hasPermission}
                >
                  <Music className="h-4 w-4 mr-2" />
                  Publicar en TSón
                </VasílalaButton>
              </div>
            )}
          </form>
        </VasílalaCardContent>
      </VasílalaCard>
      
      {/* Info Card */}
      <VasílalaCard variant="bordered">
        <VasílalaCardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium mb-1">Información importante:</p>
              <ul className="space-y-1 text-xs">
                <li>• Tu música será revisada antes de ser publicada</li>
                <li>• Solo artistas verificados pueden subir música original</li>
                <li>• Asegúrate de tener los derechos de la música que subes</li>
                <li>• Las canciones con contenido explícito deben marcarse apropiadamente</li>
              </ul>
            </div>
          </div>
        </VasílalaCardContent>
      </VasílalaCard>
    </div>
  );
};