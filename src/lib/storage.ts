import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgress {
  progress: number;
  stage: 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
}

export interface VideoProcessingResult {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Genera un thumbnail desde un video
 */
export const generateVideoThumbnail = (videoFile: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('No se pudo crear el contexto del canvas'));
      return;
    }
    
    video.onloadedmetadata = () => {
      // Configurar canvas con las dimensiones del video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Ir al segundo 1 del video para el thumbnail
      video.currentTime = Math.min(1, video.duration / 2);
    };
    
    video.onseeked = () => {
      try {
        // Dibujar el frame actual en el canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir a blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('No se pudo generar el thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        reject(error);
      }
    };
    
    video.onerror = () => {
      reject(new Error('Error al cargar el video para generar thumbnail'));
    };
    
    video.src = URL.createObjectURL(videoFile);
  });
};

/**
 * Comprime un video (simulado - en producción usarías FFmpeg.wasm o un servicio)
 */
export const compressVideo = async (
  videoFile: File, 
  quality: 'low' | 'medium' | 'high' = 'medium'
): Promise<File> => {
  // En una implementación real, aquí usarías FFmpeg.wasm para comprimir
  // Por ahora, simulamos la compresión
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular compresión reduciendo el tamaño del archivo
      const compressionRatio = quality === 'low' ? 0.3 : quality === 'medium' ? 0.6 : 0.8;
      const compressedSize = Math.floor(videoFile.size * compressionRatio);
      
      // Crear un nuevo File con el tamaño simulado
      const compressedFile = new File([videoFile], videoFile.name, {
        type: videoFile.type,
        lastModified: Date.now()
      });
      
      // Simular el nuevo tamaño (esto es solo para demo)
      Object.defineProperty(compressedFile, 'size', {
        value: compressedSize,
        writable: false
      });
      
      resolve(compressedFile);
    }, 2000); // Simular tiempo de procesamiento
  });
};

/**
 * Sube un video a Firebase Storage con progreso
 */
export const uploadVideoToStorage = async (
  videoFile: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<VideoProcessingResult> => {
  try {
    // 1. Generar thumbnail
    onProgress?.({
      progress: 10,
      stage: 'processing',
      message: 'Generando thumbnail...'
    });
    
    const thumbnailBlob = await generateVideoThumbnail(videoFile);
    
    // 2. Comprimir video si es necesario
    onProgress?.({
      progress: 20,
      stage: 'processing',
      message: 'Optimizando video...'
    });
    
    let processedVideo = videoFile;
    if (videoFile.size > 50 * 1024 * 1024) { // Si es mayor a 50MB
      processedVideo = await compressVideo(videoFile, 'medium');
    }
    
    // 3. Crear referencias de Storage
    const videoId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const videoRef = ref(storage, `videos/${userId}/${videoId}.mp4`);
    const thumbnailRef = ref(storage, `thumbnails/${userId}/${videoId}.jpg`);
    
    // 4. Subir thumbnail
    onProgress?.({
      progress: 30,
      stage: 'uploading',
      message: 'Subiendo thumbnail...'
    });
    
    const thumbnailUpload = uploadBytesResumable(thumbnailRef, thumbnailBlob);
    await thumbnailUpload;
    const thumbnailUrl = await getDownloadURL(thumbnailRef);
    
    // 5. Subir video con progreso
    onProgress?.({
      progress: 40,
      stage: 'uploading',
      message: 'Subiendo video...'
    });
    
    const videoUpload = uploadBytesResumable(videoRef, processedVideo);
    
    return new Promise((resolve, reject) => {
      videoUpload.on('state_changed',
        (snapshot) => {
          const progress = 40 + (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
          onProgress?.({
            progress: Math.round(progress),
            stage: 'uploading',
            message: `Subiendo video... ${Math.round(progress)}%`
          });
        },
        (error) => {
          console.error('Error uploading video:', error);
          onProgress?.({
            progress: 0,
            stage: 'error',
            message: 'Error al subir el video'
          });
          reject(error);
        },
        async () => {
          try {
            const videoUrl = await getDownloadURL(videoRef);
            
            // Obtener metadatos del video
            const video = document.createElement('video');
            video.src = URL.createObjectURL(videoFile);
            
            video.onloadedmetadata = () => {
              onProgress?.({
                progress: 100,
                stage: 'complete',
                message: '¡Video subido exitosamente!'
              });
              
              resolve({
                videoUrl,
                thumbnailUrl,
                duration: video.duration,
                size: processedVideo.size,
                dimensions: {
                  width: video.videoWidth,
                  height: video.videoHeight
                }
              });
            };
          } catch (error) {
            reject(error);
          }
        }
      );
    });
    
  } catch (error) {
    console.error('Error in video upload process:', error);
    onProgress?.({
      progress: 0,
      stage: 'error',
      message: 'Error al procesar el video'
    });
    throw error;
  }
};

/**
 * Elimina un video y su thumbnail de Storage
 */
export const deleteVideoFromStorage = async (videoUrl: string, thumbnailUrl: string): Promise<void> => {
  try {
    const videoRef = ref(storage, videoUrl);
    const thumbnailRef = ref(storage, thumbnailUrl);
    
    await Promise.all([
      deleteObject(videoRef),
      deleteObject(thumbnailRef)
    ]);
  } catch (error) {
    console.error('Error deleting video from storage:', error);
    throw error;
  }
};

/**
 * Valida un archivo de video
 */
export const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
  // Verificar tipo de archivo
  if (!file.type.startsWith('video/')) {
    return { isValid: false, error: 'Solo se permiten archivos de video' };
  }
  
  // Verificar tamaño (100MB máximo)
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'El archivo no puede ser mayor a 100MB' };
  }
  
  // Verificar formatos soportados
  const supportedFormats = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
  if (!supportedFormats.includes(file.type)) {
    return { isValid: false, error: 'Formato no soportado. Usa MP4, MOV o AVI' };
  }
  
  return { isValid: true };
};

/**
 * Obtiene metadatos de un video
 */
export const getVideoMetadata = (file: File): Promise<{
  duration: number;
  dimensions: { width: number; height: number };
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      // Verificar duración (máximo 3 minutos)
      if (video.duration > 180) {
        URL.revokeObjectURL(url);
        reject(new Error('El video no puede durar más de 3 minutos'));
        return;
      }
      
      resolve({
        duration: video.duration,
        dimensions: {
          width: video.videoWidth,
          height: video.videoHeight
        }
      });
      
      URL.revokeObjectURL(url);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al procesar el video'));
    };
    
    video.src = url;
  });
};