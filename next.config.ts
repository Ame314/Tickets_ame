import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Configuración para desarrollo
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:8000/:path*',
      },
    ];
  },
};

export default nextConfig;