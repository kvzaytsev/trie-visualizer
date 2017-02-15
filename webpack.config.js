var Webpack = require('webpack');

module.exports = {
    devtool: "inline-source-map",
    entry: "./src/index.js",
    output: {
        path: '/',
        filename: "./dist/bundle.js"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader", // Do not use "use" here
                options: {}
            }
        ]
    }
};
