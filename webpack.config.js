"use strict";
var path = require('path');
var webpack = require('webpack');
var bower_dir = path.join(__dirname, '/bower_components');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname);

var config = {
	addVendor: function(name, path){
		this.resolve.alias[name] = path;
		this.module.noParse.push(path);
	},
	entry: {
		app: ['babel-polyfill', "./app/js/index.js"],
		vendors: ["d3", "_"]
	},
	output: {
    path: process.env.NODE_ENV === 'production' ? path.resolve(ROOT_PATH, 'app/dist') : path.resolve(ROOT_PATH, 'app/build'),
		"filename": "bundle.js"
	},
	module: {
		noParse: [],
		loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader?root=." },
      { loader: "babel-loader",

        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, "app/js"),
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
      // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      { test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' }
		]
	},
	resolve: {
		alias: {},
    root: [path.join(__dirname, "app/css"), path.join(__dirname, "app/js")]
	},
	plugins: [
		// This plugin makes a module available as variable in every module
		new webpack.ProvidePlugin({
			d3: "d3",
      _: "_"
		}),
		// CommonsChunkPlugin will take the vendors chunk and create a commonly used js file
		new webpack.optimize.CommonsChunkPlugin('vendors','vendors.js', Infinity),
    // https://www.npmjs.com/package/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: 'D3 and react',
      template: 'build/index.html'
    })
	]

};

config.addVendor('d3', bower_dir + '/d3/d3.min.js');
config.addVendor('_', bower_dir + '/lodash/lodash.min.js');

module.exports = config;
