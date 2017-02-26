
"use strict";
var path = require('path');
var webpack = require('webpack');
var npm_dir = path.join(__dirname, '/node_modules');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname);

var config = {
	entry: {
		app: ['babel-polyfill', "./client/app/index.js"]
	},
  devtool: 'source-map',
	output: {
    path: process.env.NODE_ENV === 'production' ? path.join(ROOT_PATH, 'dist') : path.join(ROOT_PATH, 'build'),
		"filename": "bundle.js",
    publicPath: ''
	},
	module: {
		noParse: [],
		loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader?root=." },
      { test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']},
      { loader: "babel-loader",

        // Skip any files outside of your project's `src` directory
        include: [
          path.join(__dirname, "client/app"),
        ],

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        // Options to configure babel with
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      { test: /\.gif$/, loader: "url-loader?mimetype=image/png" },
      { test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' }
		]
	},
	resolve: {
		alias: {},
    root: [path.join(__dirname, "client/app")]
	},
  devServer: {
    contentBase: path.join(ROOT_PATH, 'build'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    port: '3030',
    displayErrorMessages: true
  },
	plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // https://www.npmjs.com/package/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: 'D3 and react',
      template: 'build/index.html'
    })
	]

};
module.exports = config;
