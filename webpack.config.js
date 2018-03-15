const path = require('path')
const webpack = require('webpack')

module.exports = {
    name: "service",
    entry: path.join(__dirname, 'src/main/js/template_verticle.js'),
    output: {
        path: path.join(__dirname, 'build/js'),
        filename: "template_verticle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                // exclude: /node_modules/,
                options: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    resolve: {
        modules: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'src/main/js')
        ]
    },
    mode: 'production'
}