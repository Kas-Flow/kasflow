import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack has better WASM support out of the box
  turbopack: {},

  // Webpack configuration for WASM support in client bundles
  webpack: (config, { isServer, webpack }) => {
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

      // CRITICAL: Prevent class name mangling for WASM modules
      // kaspa-wasm-web expects specific class names like 'Resolver'
      // If minified to random names like 'I6', WASM fails with:
      // "object constructor `I6` does not match expected class `Resolver`"

      // Import TerserPlugin
      const TerserPlugin = require('terser-webpack-plugin');

      // Replace the minimizer with our custom Terser configuration
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              // Enable compression but preserve what we need
              drop_console: false,
              drop_debugger: true,
            },
            mangle: {
              // Disable all mangling - this is the nuclear option but necessary for WASM
              keep_classnames: true,
              keep_fnames: true,
            },
            format: {
              comments: false,
            },
          },
        }),
      ];
    }

    return config;
  },
};

export default nextConfig;
