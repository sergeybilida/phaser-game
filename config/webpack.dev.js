const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app/index.js',
  devServer: {
    host: '0.0.0.0'
  },
  output: {
    filename: '[name].js'
  },
  resolve: {
    modules: ['node_modules']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: './src/assets/', to: 'assets/'}
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /.*\.(png|jpg)$/, loader: 'file-loader', options: {
          name: '[name].[ext]'
        }
      }
    ]
  }
};
