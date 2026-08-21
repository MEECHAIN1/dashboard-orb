/** @type {import('next').NextConfig} */

const configuredBasePath = process.env.BASE_PATH?.trim() || '/';
const basePath =
  configuredBasePath === '/' ? '' : `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}`;

const nextConfig = {
  basePath,
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: {
    buildActivity: false
  }
};

module.exports = nextConfig;
