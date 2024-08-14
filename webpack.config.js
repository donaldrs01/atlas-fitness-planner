const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/login.html",
      filename: "login.html"
    }),
    new HtmlWebpackPlugin({
      template: "./public/signup.html",
      filename: "signup.html"
    }),
    new HtmlWebpackPlugin({
      template: "./public/homepage.html",
      filename: "homepage.html"
    }),
    new HtmlWebpackPlugin({
      template: "./public/resources.html",
      filename: "resources.html"
    })
  ]
};