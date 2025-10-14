'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { VasílalaButton } from '@/components/ui/vasilala-button';
import { VasílalaInput } from '@/components/ui/vasilala-input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  uploadVideoToStorage, 
  validateVideoFile, 
  getVideoMetadata,
  type UploadProgress 
} from '@/lib/storage';
import { createVideoPost } from '@/lib/posts';
import { 
  Upload, 
  Video, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Scissors,
  Palette,
  Type,
  Music,
  Hash,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface VideoFile {
  file: File;
  url: string;
  duration: number;
  size: number;
  dimensions: { width: number; height: number };
}

interface VideoMetadata {
  caption: string;
  hashtags: string[];
  location: string;
  isPublic: boolean;
  allowComments: boolean;
  allowDuets: boolean;
}

export const VideoUploader: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata>({
    caption: '',
    hashtags: [],
    location: '',
    isPublic: true,
    allowComments: true,
    allowDuets: true,
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    stage: 'uploading',
    message: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      toast({
        variant: 'destructive',
        title: 'Archivo inválido',
        description: validation.error
      });
      return;
    }
    
    try {
      // Get video metadata
      const videoMetadata = await getVideoMetadata(file);
      const url = URL.createObjectURL(file);
      
      setVideoFile({
        file,
        url,
        duration: videoMetadata.duration,
        size: file.size,
        dimensions: videoMetadata.dimensions,
      });
      
      toast({
        title: 'Video cargado',
        description: 'Tu video está listo para ser editado y publicado'
      });
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al procesar video',
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }, [toast]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // Video controls
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Hashtag handling
  const addHashtag = () => {
    if (hashtagInput.trim() && !metadata.hashtags.includes(hashtagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()]
      }));
      setHashtagInput('');
    }
  };

  const removeHashtag = (hashtag: string) => {
    setMetadata(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  // Upload video
  const handleUpload = async () => {
    if (!videoFile || !userProfile) return;
    
    if (!metadata.caption.trim()) {
      toast({
        variant: 'destructive',
        title: 'Descripción requerida',
        description: 'Agrega una descripción a tu video'
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload video to Firebase Storage
      const uploadResult = await uploadVideoToStorage(
        videoFile.file,
        userProfile.id,
        (progress) => {
          setUploadProgress(progress);
        }
      );
      
      // Create post in Firestore
      const postId = await createVideoPost({
        userId: userProfile.id,
        videoUrl: uploadResult.videoUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        caption: metadata.caption.trim(),
        hashtags: metadata.hashtags,
        location: metadata.location.trim() || undefined,
        duration: uploadResult.duration,
        dimensions: uploadResult.dimensions,
        isPublic: metadata.isPublic,
        allowComments: metadata.allowComments,
        allowDuets: metadata.allowDuets
      });
      
      toast({
        title: '¡Video publicado!',
        description: 'Tu video ha sido publicado exitosamente en el feed'
      });
      
      // Reset form
      setTimeout(() => {
        if (videoFile) {
          URL.revokeObjectURL(videoFile.url);
        }
        setVideoFile(null);
        setMetadata({
          caption: '',
          hashtags: [],
          location: '',
          isPublic: true,
          allowComments: true,
          allowDuets: true,
        });
        setUploadProgress({
          progress: 0,
          stage: 'uploading',
          message: ''
        });
        setIsUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        variant: 'destructive',
        title: 'Error al subir video',
        description: 'Hubo un problema al subir tu video. Intenta nuevamente.'
      });
      setIsUploading(false);
      setUploadProgress({
        progress: 0,
        stage: 'error',
        message: 'Error al subir el video'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {!videoFile ? (
        /* Upload Area */
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${dragActive 
              ? 'border-yellow-500 bg-yellow-500/10' 
              : 'border-gray-600 hover:border-gray-500'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-yellow-500" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Arrastra tu video aquí
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                O haz clic para seleccionar un archivo
              </p>
              
              <VasílalaButton
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
              >
                Seleccionar Video
              </VasílalaButton>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Formatos soportados: MP4, MOV, AVI</p>
              <p>Tamaño máximo: 100MB • Duración: 15-60 segundos</p>
            </div>
          </div>
        </div>
      ) : (
        /* Video Preview and Metadata */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Preview */}
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-w-sm mx-auto">
              <video
                ref={videoRef}
                src={videoFile.url}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
              />
              
              {/* Video Controls */}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {/* Remove Video Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  URL.revokeObjectURL(videoFile.url);
                  setVideoFile(null);
                }}
                className="absolute top-2 right-2 text-white hover:bg-red-500/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Video Info */}
            <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Duración:</span>
                <span className="text-white">{formatDuration(videoFile.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tamaño:</span>
                <span className="text-white">{formatFileSize(videoFile.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Resolución:</span>
                <span className="text-white">
                  {videoFile.dimensions.width}x{videoFile.dimensions.height}
                </span>
              </div>
            </div>
          </div>
          
          {/* Metadata Form */}
          <div className="space-y-6">
            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <Textarea
                placeholder="Describe tu video..."
                value={metadata.caption}
                onChange={(e) => setMetadata(prev => ({ ...prev, caption: e.target.value }))}
                className="min-h-[100px] bg-gray-800 border-gray-700 focus:border-yellow-500"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {metadata.caption.length}/500 caracteres
              </p>
            </div>
            
            {/* Hashtags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hashtags
              </label>
              <div className="flex space-x-2 mb-2">
                <VasílalaInput
                  placeholder="Agregar hashtag..."
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                  icon={<Hash className="h-4 w-4" />}
                />
                <Button onClick={addHashtag} size="sm">
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {metadata.hashtags.map((hashtag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                  >
                    #{hashtag}
                    <button
                      onClick={() => removeHashtag(hashtag)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Location */}
            <VasílalaInput
              label="Ubicación (opcional)"
              placeholder="¿Dónde grabaste este video?"
              value={metadata.location}
              onChange={(e) => setMetadata(prev => ({ ...prev, location: e.target.value }))}
              icon={<MapPin className="h-4 w-4" />}
            />
            
            {/* Privacy Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Configuración de Privacidad</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {metadata.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <span className="text-sm">Público</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMetadata(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                  className={metadata.isPublic ? 'text-green-500' : 'text-gray-400'}
                >
                  {metadata.isPublic ? 'Sí' : 'No'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir comentarios</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMetadata(prev => ({ ...prev, allowComments: !prev.allowComments }))}
                  className={metadata.allowComments ? 'text-green-500' : 'text-gray-400'}
                >
                  {metadata.allowComments ? 'Sí' : 'No'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir duetos</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMetadata(prev => ({ ...prev, allowDuets: !prev.allowDuets }))}
                  className={metadata.allowDuets ? 'text-green-500' : 'text-gray-400'}
                >
                  {metadata.allowDuets ? 'Sí' : 'No'}
                </Button>
              </div>
            </div>
            
            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {uploadProgress.stage === 'complete' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : uploadProgress.stage === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500" />
                  )}
                  <span className="text-sm text-gray-300">
                    {uploadProgress.message}
                  </span>
                </div>
                
                {uploadProgress.stage !== 'complete' && uploadProgress.stage !== 'error' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{Math.round(uploadProgress.progress)}%</span>
                    </div>
                    <Progress value={uploadProgress.progress} className="h-2" />
                  </div>
                )}
              </div>
            )}
            
            {/* Upload Button */}
            <VasílalaButton
              variant="primary"
              onClick={handleUpload}
              disabled={isUploading || !metadata.caption.trim()}
              isLoading={isUploading}
              loadingText="Subiendo..."
              className="w-full"
            >
              {isUploading ? 'Subiendo Video...' : 'Publicar Video'}
            </VasílalaButton>
          </div>
        </div>
      )}
    </div>
  );
};