const webpack = require("webpack")
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
var HtmlWebpackPlugin = require('html-webpack-plugin')

const outpath = path.resolve(__dirname, "pack")

function makeCommonConfig() {
	const commonConfig = {
		target: "web",
		mode: "development",
		entry: "./src/index.js",
		node: {
			__dirname: false,
			__filename: false
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: "ts-loader",
					exclude: [/node_modules/],
				},
				{
					test: /\.html$/,
					loader: "file-loader",
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
					  'style-loader',
					  'css-loader',
					  'sass-loader',
					],
				},
				{
					test: /\.(tsx?|js|jsx|html)$/,
					use: [
					],
					exclude: [/node_modules/],
				}
			]
		},
		resolve: {
			modules: [
				'node_modules',
				path.resolve(__dirname),
			],
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
		},
		plugins: [
			new CopyPlugin({
				patterns: [
					{ from: path.resolve(__dirname, "src/static"), to: "static" },
					{ from: path.resolve(__dirname, "node_modules/easymde/dist/easymde.min.css"), to: "static" },
				],
			}),
			new HtmlWebpackPlugin({
				inject: true,
				title: "OCTO",
				chunks: ["main"],
				template: "html-templates/page.ejs",
				filename: 'index.html',
				publicPath: '/'
			}),
		],
		entry: {
			main: "./src/client/main.tsx",
		},
		output: {
			filename: "static/[name].js",
			path: outpath
		}
	}

	return commonConfig
}

module.exports = makeCommonConfig
