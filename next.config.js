/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de imagen para Vercel
  images: {
    domains: [
      'picsum.photos',
      'images.unsplash.com',
      'commondatastorage.googleapis.com',
      'sample-videos.com',
      'firebasestorage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Variables de entorno públicas
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Optimizaciones de build (swcMinify es por defecto en Next.js 15)
  
  // Configuración experimental para mejor rendimiento
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
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
    
    // Excluir archivos problemáticos de Genkit
    config.externals = config.externals || [];
    config.externals.push({
      'handlebars': 'handlebars'
    });
    
    return config;
  },
  
  // Headers para mejor rendimiento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;