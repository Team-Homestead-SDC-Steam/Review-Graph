const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'client', 'components', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'client', 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
};
