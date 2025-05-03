/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "cdn.kastatic.org", 
      "yt3.ggpht.com", 
      "images.unsplash.com", 
      "lh3.googleusercontent.com", 
      "plus.unsplash.com", 
      "img.freepik.com",
      "via.placeholder.com"  // Added placeholder domain for mock user images
    ],
  },
};

export default nextConfig;
