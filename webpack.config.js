var path = require('path');
var webpack = require('webpack');
var NpmInstallPlugin = require('npm-install-webpack-plugin');
var autoprefixer = require('autoprefixer');
var precss = require('precss');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        'babel-regenerator-runtime', //'babel-polyfill',
        './frontend/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new NpmInstallPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel?cacheDirectory'],
                include: [
                    path.resolve(__dirname, "frontend")
                ],
                plugins: ['transform-runtime']
            },
            {
                test: /\.less$/,
                loader: "style!css-loader!postcss-loader!less-loader"
            },
            {
                test: /\.json$/,
                loader: "json"
            },
            {test: /\.(?:woff|woff2|png|jpg|jpeg|gif|svg)$/, loader: 'url?limit=10000'},
            {test: /\.(?:ttf|eot)$/, loader: 'file'}
        ]
    },
    resolve: {
        alias: {
            'node-fetch': 'whatwg-fetch', //require.resolve('pubnub/modern/pubnub')
            'pubnub': require.resolve('pubnub/modern/pubnub')
        }
    },
    postcss: function() {
        return [autoprefixer, precss];
    }
};
