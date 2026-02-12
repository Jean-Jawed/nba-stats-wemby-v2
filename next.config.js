/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permettre les images externes si nécessaire
  images: {
    unoptimized: true, // Pour les images locales dans /public
  },
};

module.exports = nextConfig;
