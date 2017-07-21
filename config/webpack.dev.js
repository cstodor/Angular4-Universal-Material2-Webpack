// Webpack development build configuration file.
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    // Although you tell Webpack to put output bundles in the dist folder, the dev server keeps all bundles in memory; 
    // it doesn't write them to disk. You won't find any files in the dist folder, at least not any generated from this development build.
    // The HtmlWebpackPlugin, added in webpack.common.js, uses the publicPath and the filename settings to 
    // generate appropriate <script> and <link> tags into the index.html.
    output: {
        path: helpers.root('dist'), // put output bundles folder
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        // The CSS styles are buried inside the Javascript bundles by default. 
        // The ExtractTextPlugin extracts them into external .css files that the HtmlWebpackPlugin inscribes as <link> tags into the index.html.
        new ExtractTextPlugin('[name].css')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});