const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: { 
    josh3d: './src/index.ts',
    misc: './misc/index.ts' 
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './public',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'josh3d-engine',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};