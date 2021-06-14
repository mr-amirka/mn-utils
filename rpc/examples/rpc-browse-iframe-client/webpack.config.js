const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {MnPlugin} = require('minimalist-notation/webpack-loader');

module.exports = {
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  devServer: {
    contentBase: Path.join(__dirname, 'dist'),
    compress: true,
    open: true,
    port: 9000,
    openPage: 'client.html',
  },
  mode:
    // 'production',
    'development',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: {
    host: './src/host.js',
    client: './src/client.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.mn\.js$/,
        use: [
          {
            loader: 'minimalist-notation/webpack-loader/reload',
          },
        ],
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-flow',
              ],
              plugins: [
                '@babel/syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                ['@babel/plugin-proposal-decorators', {legacy: true}],
                ['@babel/plugin-transform-react-jsx', {
                  // default pragma is React.createElement
                  'pragma': 'React.createElement',

                  // default is React.Fragment
                  'pragmaFrag': 'DomFrag',

                  // defaults to true
                  'throwIfNamespace': false,
                }],
              ],
            },
          },
          {
            loader: 'minimalist-notation/webpack-loader',
            options: {
              id: 'app',
              attrs: {className: 'class'},
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|otf|ttf|eot|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/static/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MnPlugin({
      id: 'app',
      attrs: ['class'],
      output: [
        './dist/mn.css',
      ],
      template: [
        './src/host.html',
        './src/client.html',
      ],
      presets: [
        require('minimalist-notation/presets/styles'),
        require('minimalist-notation/presets/medias'),
        require('minimalist-notation/presets/prefixes'),
        require('minimalist-notation/presets/states'),
        require('minimalist-notation/presets/main'),
      ],
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/host.html',
      filename: 'host.html',
      chunks: [],
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/client.html',
      filename: 'client.html',
      chunks: [],
    }),
  ],
};
