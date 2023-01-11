const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [{
    entry: './src/index.tsx',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: 'file-loader'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'index.js',
    },
    devServer: {
        port: 80,
        static: './dist',
        hot: true,
    },  
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src/index.html")
        })
    ]
}];