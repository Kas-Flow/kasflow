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

      // CRITICAL: Prevent class name mangling for WASM modules
      // kaspa-wasm-web expects specific class names like 'Resolver'
      // If minified to random names like 'I6', WASM fails with:
      // "object constructor `I6` does not match expected class `Resolver`"
      if (config.optimization) {
        config.optimization.minimize = true;

        // Find existing TerserPlugin and update it
        const terserPluginIndex = config.optimization.minimizer?.findIndex(
          (plugin: any) => plugin.constructor.name === 'TerserPlugin'
        );

        if (terserPluginIndex !== undefined && terserPluginIndex >= 0 && config.optimization.minimizer) {
          // Update existing TerserPlugin options
          const TerserPlugin = config.optimization.minimizer[terserPluginIndex].constructor;
          config.optimization.minimizer[terserPluginIndex] = new TerserPlugin({
            terserOptions: {
              keep_classnames: true, // Preserve ALL class names for WASM compatibility
              keep_fnames: true,     // Preserve ALL function names for WASM compatibility
            },
          });
        }
      }
    }

    return config;
  },
};

export default nextConfig;
