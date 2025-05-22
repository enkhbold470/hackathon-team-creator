import withPWA from 'next-pwa';
import runtimeCaching from "next-pwa/cache.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
  poweredByHeader: false,
  swcMinify: true,
  
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching,
  // disable: process.env.NODE_ENV === 'development', // Consider disabling PWA in development for easier debugging
})(nextConfig);
