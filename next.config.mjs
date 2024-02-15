/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Modify webpack configuration here
        if (!isServer) {
          // Add webpack configuration for client-side bundles
        } else {
          // Add webpack configuration for server-side bundles
        }
    
        return config;
      },
};

export default nextConfig;
