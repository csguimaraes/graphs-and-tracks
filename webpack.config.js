const path = require('path')
const webpack = require('webpack')

// Webpack Plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event
const isProd = ENV === 'build'
const baseUrl = '/'
module.exports = function makeWebpackConfig() {
	/**
	 * Config
	 * Reference: http://webpack.github.io/docs/configuration.html
	 * This is the object where all configuration gets set
	 */
	let config = {}

	config.devtool = 'source-map'

	// add debug messages
	config.debug = !isProd

	config.entry = {
		'polyfills': './src/polyfills.ts',
		'vendor': './src/vendor.ts',
		'app': './src/main.ts'
	}

	config.output = {
		path: root('dist'),
		publicPath: baseUrl,
		filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
		chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
	}

	config.resolve = {
		cache: true,
		root: root(),
		extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
		alias: {
			'app': root('src/app'),
			'common': root('src/common')
		}
	}

	/**
	 * Loaders
	 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
	 * List: http://webpack.github.io/docs/list-of-loaders.html
	 * This handles most of the magic responsible for converting modules
	 */
	config.module = {
		preLoaders: [{ test: /\.ts$/, loader: 'tslint' }],
		loaders: [
			// Support for .ts files.
			{
				test: /\.ts$/,
				loaders: ['ts', 'angular2-template-loader'],
				exclude: [/node_modules\/(?!(ng2-.+))/]
			},

			// Style loaders for components (will be embedded within the component code)
			{ test: /\.scss$/, include: root('src', 'app'), loader: 'raw!postcss!sass' },

			// Style loaders for the app (will generate a standalone css and be added in the index.html head) ${TEXT_COLOR_AS_FILL}
			{ test: /\.scss$/, include: root('public'), loader: ExtractTextPlugin.extract({ loader: `css!postcss!sass` }) },



			// Support for *.json files.
			{ test: /\.json$/, loader: 'json' },

			// copy those assets to output
			{ test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=fonts/[name].[hash].[ext]?' },

			// support for .html as raw text
			// Todo: use a loader that add image hashes
			{ test: /\.html$/, loader: 'raw' }
		],
		postLoaders: [],
		noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /angular2-polyfills\.js/]
	}

	/**
	 * Plugins
	 * Reference: http://webpack.github.io/docs/configuration.html#plugins
	 * List: http://webpack.github.io/docs/list-of-plugins.html
	 */
	config.plugins = [
		// Define env variables to help with builds
		// Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
		new webpack.DefinePlugin({
			// Environment helpers
			'process.env': {
				ENV: JSON.stringify(ENV)
			}
		}),

		// Generate common chunks if necessary
		// Reference: https://webpack.github.io/docs/code-splitting.html
		// Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
		new CommonsChunkPlugin({
			name: ['vendor', 'polyfills']
		}),

		// Inject script and link tags into html files
		// Reference: https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			template: root('/public/main.ejs'),
			favicon: root('/public/img/favicon.png'),
			chunksSortMode: 'dependency',
			minify: false,
			// inject: 'head',
			baseUrl: baseUrl
		}),

		// Extract css files
		// Reference: https://github.com/webpack/extract-text-webpack-plugin
		new ExtractTextPlugin({
			filename: 'css/[name].[hash].css'
		}),

		new ContextReplacementPlugin(
			/angular\/core\/(esm\/src|src)\/linker/,
			root('src')
		),
	]

	config.htmlLoader = {
		minimize: false // workaround for ng2
	}


	// Add build specific plugins
	if (isProd) {
		config.plugins.push(
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
			// Only emit files when there are no errors
			new webpack.NoErrorsPlugin(),

			// Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
			// Dedupe modules in the output
			new webpack.optimize.DedupePlugin(),

			// Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
			// Minify all javascript, switch loaders to minimizing mode
			new webpack.optimize.UglifyJsPlugin({mangle: { keep_fnames: true }}),

			// Copy assets from the public folder
			// Reference: https://github.com/kevlened/copy-webpack-plugin
			new CopyWebpackPlugin([{
				from: root('public'),
				ignore: [
					'*.scss',
					'main.ejs'
				]
			}])
		)
	}

	/**
	 * Sass
	 * Reference: https://github.com/jtangelder/sass-loader
	 * Transforms .scss files to .css
	 */
	config.sassLoader = {
		//includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
	}

	/**
	 * Apply the tslint loader as pre/postLoader
	 * Reference: https://github.com/wbuchwalter/tslint-loader
	 */
	config.tslint = {
		emitErrors: false,
		failOnHint: false
	}

	/**
	 * Dev server configuration
	 * Reference: http://webpack.github.io/docs/configuration.html#devserver
	 * Reference: http://webpack.github.io/docs/webpack-dev-server.html
	 */
	config.devServer = {
		contentBase: './public',
		historyApiFallback: true,
		stats: 'minimal'
	}

	return config
}()

// Helper functions
function root(args) {
	args = Array.prototype.slice.call(arguments, 0)
	return path.join.apply(path, [__dirname].concat(args))
}
