var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    // the entry-point files that define the bundles
    entry: {
        'polyfills': './src/polyfills.ts', // needed to run Angular applications in most modern browsers
        'vendor': './src/vendor.ts', // third-party dependencies such as Angular, lodash, and bootstrap.css
        'app': './src/main.ts' // the application code
    },
    // how to resolve file names when they lack extensions
    resolve: {
        extensions: ['.ts', '.js'] // resolve extension-less file requests, you can also add html and css
    },
    // rules for deciding how files are loaded and which loaders to use for each file, or module
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'awesome-typescript-loader', // a loader to transpile the Typescript code to ES5, guided by the tsconfig.json file.
                        options: { configFileName: helpers.root('src', 'tsconfig.json') }
                    }, 'angular2-template-loader' // loads angular components' template and styles.
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader' // for component templates
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]' // images and fonts are bundled as well
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' }) // matches application-wide styles
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw-loader' // handles component-scoped styles
            }
        ]
    },
    // creates instances of the plugins
    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        ),

        // identifies the hierarchy among three chunks: app -> vendor -> polyfills. 
        // Where Webpack finds that app has shared dependencies with vendor, 
        // it removes them from app. It would remove polyfills from vendor if they shared dependencies, which they don't.
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        // Webpack generates a number of js and CSS files. You could insert them into the index.html manually. 
        // That would be tedious and error-prone. Webpack can inject those scripts and links for you with the HtmlWebpackPlugin.
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};