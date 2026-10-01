const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { dependencies } = require('./package.json');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Production bundles are consumed from whichever origin serves remoteEntry.js,
      // so let webpack derive the public path at runtime. Dev keeps CRA's '/'.
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.output.publicPath = 'auto';
      }

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'NewsApp',
          filename: 'remoteEntry.js',
          exposes: {
            './NewsApp': './src/App',
          },
          shared: {
            react: { singleton: true, requiredVersion: dependencies.react },
            'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] },
            'framer-motion': { singleton: true, requiredVersion: dependencies['framer-motion'] },
            axios: { singleton: true, requiredVersion: dependencies.axios },
          },
        })
      );
      return webpackConfig;
    },
  },
};
