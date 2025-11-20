/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ggpht.com", // Google image CDN
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // Sometimes used for thumbnails
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Common for business photos
      },
    ],
  },
};

module.exports = nextConfig;
