import type { NextConfig } from 'next';

const configuredBasePath = process.env.BASE_PATH?.trim() || '/';
const basePath =
  configuredBasePath === '/' ? '' : `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}`;

const nextConfig: NextConfig = {
  basePath,
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
};

export default nextConfig;