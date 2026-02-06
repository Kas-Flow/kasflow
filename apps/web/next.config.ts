import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack has better WASM support out of the box
  turbopack: {},

  // Webpack configuration for WASM support in client bundles
  webpack: (config, { isServer }) => {
    // Enable WASM support for client-side bundles
    if (!isServer) {
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };

      // Optimize WASM module handling
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });
    }

    return config;
  },
};

export default nextConfig;
