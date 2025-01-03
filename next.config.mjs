/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cdn.kastatic.org", "yt3.ggpht.com", "images.unsplash.com", "lh3.googleusercontent.com"], // Add the hostnames here
  },
};

export default nextConfig;
