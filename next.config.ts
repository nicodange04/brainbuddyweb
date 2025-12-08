import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Vercel
  output: 'standalone',
  
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración de headers para seguridad
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
  
  // Configuración experimental para Next.js 16
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  
  // Deshabilitar trace para evitar problemas de permisos en Windows
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
