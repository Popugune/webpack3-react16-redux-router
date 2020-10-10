module.exports = (paths) => ({
  test: /\.css$/,
  include: paths,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: true,
        localIdentName: '[folder]__[local]--[contenthash:base64:5]',
      },
    },
  ],
});
