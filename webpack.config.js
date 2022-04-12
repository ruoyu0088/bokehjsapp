const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: "./src/index.html",
                to: "index.html"
            }, ],
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false
    },
    externals: {
        "@bokeh/bokehjs": 'root Bokeh',
        "jquery": 'root $',
        "papaparse": 'root Papa'
    },
};