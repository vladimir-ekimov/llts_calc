const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = [{
    entry: './src/index.ts',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'index.js',
    }
}]