var Webpack = require('webpack');

module.exports = {
    devtools: 'inline-source-map',

    entry: "./src/index.js",
    output: {
        path: './',
        filename: "./dist/bundle.js"
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            }
        ]
    }

};
