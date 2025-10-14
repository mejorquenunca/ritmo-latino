/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para despliegue
  output: 'standalone',
  
  // Optimizaciones de imagen
  images: {
    domains: [
      'picsum.photos',
      'images.unsplash.com',
      'commondatastorage.googleapis.com',
      'sample-videos.com',
      'firebasestorage.googleapis.com'
    ],
    unoptimized: true // Para compatibilidad con hosting estático
  },
  
  // Variables de entorno públicas
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Configuración para Firebase
  trailingSlash: true,
  
  // Optimizaciones de build
  swcMinify: true,
  
  // Configuración experimental
  experimental: {
    // Mejoras de rendimiento
    optimizeCss: true,
  },
  
  // Configuración de webpack para optimizar el bundle
  webpack: (config, { isServer }) => {
    // Optimizaciones adicionales
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;