var webpack = require('webpack');
var bower_dir = __dirname + '/bower_components';

var config = {
	addVendor: function(name, path){
		this.resolve.alias[name] = path;
		this.module.noParse.push(path);
	},
	entry: {
		app: ["./app/js/triangles.js"],
		vendors: ["d3"]
	},
	output: {
		"path": "./build",
		"filename": "bundle.js"
	},
	module: {
		noParse: [],
		loaders: [
			{test: /\.css$/, loader: 'style!css'}
		]
	},
	resolve: {
		alias: {}
	},
	plugins: [
		// This plugin makes a module available as variable in every module
		new webpack.ProvidePlugin({
			d3: "d3"
		}),
		// CommonsChunkPlugin will take the vendors chunk and create a commonly used js file
		new webpack.optimize.CommonsChunkPlugin('vendors','vendors.js', Infinity)
	]

};

config.addVendor('d3', bower_dir + '/d3/d3.min.js');

module.exports = config;
