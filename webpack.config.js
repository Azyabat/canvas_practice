const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: "production",
    entry: './src/script.js',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    plugins: [
        new HTMLWebpackPlugin({
            title:"Azyabat",
            template: "./src/index.html"
        }),
        new CleanWebpackPlugin()
    ],
    module:{
        rules: [{
            test: /\.css$/,
            use: ['style-loader','css-loader']
        }]
    }
}