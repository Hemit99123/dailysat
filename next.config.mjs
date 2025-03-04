// import { name } from "file-loader";
// import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cdn.kastatic.org", "yt3.ggpht.com", "images.unsplash.com", "lh3.googleusercontent.com", "plus.unsplash.com"], // Add the hostnames here
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: `/_next/static/sounds/`,
          outputPath: `${isServer ? "../" : ""}static/sounds/`,
          name: "[name].[ext]",
        }
      }
    })
    return config;
  }
};

export default nextConfig;
