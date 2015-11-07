"use strict";
var path = require('path');
var webpack = require('webpack');
var bower_dir = path.join(__dirname, '/bower_components');


var config = {
	addVendor: function(name, path){
		this.resolve.alias[name] = path;
		this.module.noParse.push(path);
	},
	entry: {
		app: ["./app/js/triangles.js"],
		vendors: ["d3", "_"]
	},
	output: {
		"path": "./build",
		"filename": "bundle.js"
	},
	module: {
		noParse: [],
		loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader?root=." },
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
    }
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
		new webpack.optimize.CommonsChunkPlugin('vendors','vendors.js', Infinity)
	]

};

config.addVendor('d3', bower_dir + '/d3/d3.min.js');
config.addVendor('_', bower_dir + '/lodash/lodash.min.js');

module.exports = config;
