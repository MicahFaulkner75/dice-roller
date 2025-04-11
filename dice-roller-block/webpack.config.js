const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    ...defaultConfig,
    entry: {
        'block': './src/block/index.js',
        'dice-roller': './src/dice-roller/bundler.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },
    optimization: {
        ...defaultConfig.optimization,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: process.env.NODE_ENV === 'production',
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
}; 