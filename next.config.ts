import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  // Для DigitalOcean App Platform используем стандартный режим (next start)
  // output: 'standalone', // Используется только для Docker
  
  // Явно указываем, что используем src директорию
  // Next.js автоматически определит это, но лучше быть явным
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Turbopack только для dev режима, не нужен в production
  ...(process.env.NODE_ENV === 'development' && {
    turbopack: {
      rules: {
        "*.{jsx,tsx}": {
          loaders: [LOADER]
        }
      }
    }
  }),
  
  // Убеждаемся, что production сборка работает правильно
  reactStrictMode: true,
  
  // Отключаем оптимизации, которые могут вызывать проблемы
  swcMinify: true,
  
  // Явно указываем hostname для production
  // Это важно для работы на DigitalOcean
  ...(process.env.NODE_ENV === 'production' && {
    // Убеждаемся, что Next.js правильно обрабатывает запросы
    poweredByHeader: false,
  }),
};

export default nextConfig;
