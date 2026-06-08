// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['*.local', '*.lan', '192.168.0.*', '192.168.18.*'],  images: {
  // allowedDevOrigins: ['*.local', '*.lan', '192.168.0.*', '192.168.18.8'],  images: {
    unoptimized: true,
  },
  
};

export default nextConfig;