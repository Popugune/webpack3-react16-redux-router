const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const cssDev = [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }];
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }],
});

const cssConfig = isProd ? cssProd : cssDev;

module.exports = {

  entry: {
    app: './app/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'chunk.[id].[chunkhash:8].js',
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: './dist',
    hot: true,
    compress: true,
    port: 8080,
    stats: 'errors-only',
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'WR3',
      template: 'app/index.ejs',
      inject: 'body',
      hash: true,
      cache: true,
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: !isProd,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
      minChunks: 2,
    }),
    new webpack.optimize.UglifyJsPlugin({
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      parallel: 4,
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react', 'react-optimize', 'stage-1'],
            },
          },
        ],
      },
      {
        test: /\.(css|sass|scss)$/,
        use: cssConfig,
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[sha512:hash:base64:7].[ext]',
              outputPath: 'img/',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
};
