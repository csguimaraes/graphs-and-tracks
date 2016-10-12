const path = require('path')
const webpack = require('webpack')

const DefinePlugin = webpack.DefinePlugin
const ContextReplacementPlugin = webpack.ContextReplacementPlugin
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const AwesomeTypescriptLoader = require('awesome-typescript-loader')

const ENV = process.env.npm_lifecycle_event
const IS_PROD = ENV === 'build'
const HMR = hasProcessFlag('hot');
const BASE_URL = '/'

module.exports = function makeWebpackConfig() {
	/**
	 * Config
	 * Reference: http://webpack.github.io/docs/configuration.html
	 * This is the object where all configuration gets set
	 */
	let config = {}

	config.devtool = 'source-map'

	// add debug messages
	config.debug = !IS_PROD

	config.entry = {
		'polyfills': src('polyfills.ts'),
		'vendor': src('vendor.ts'),
		'app': src('main.ts')
	}

	config.output = {
		path: root('dist'),
		publicPath: BASE_URL,
		filename: IS_PROD ? 'js/[name].[hash].js' : 'js/[name].js',
		chunkFilename: IS_PROD ? '[id].[hash].chunk.js' : '[id].chunk.js'
	}

	config.resolve = {
		cache: true,
		root: root(),
		extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
		alias: {
			'app': src('app')
		},
		plugins: [
			new AwesomeTypescriptLoader.TsConfigPathsPlugin()
		]
	}

	config.module = {
		preLoaders: [
			{
				test: /\.ts$/,
				loader: 'tslint'
			}
		],

		loaders: [
			{
				test: /\.ts$/,
				loaders: [
					'@angularclass/hmr-loader?pretty=' + !IS_PROD + '&prod=' + IS_PROD,
					'awesome-typescript-loader',
					'angular2-template-loader'
				]
			},

			// Style loaders for the app (will generate a standalone css and be added in the template <head>)
			// { test: /\.scss$/, include: src('app', 'app.component.ts'), loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css', 'postcss', 'sass']}) },

			// Style loaders for components (will be embedded within the component code)
			{ test: /\.scss$/, include: src('app'), loader: 'raw!postcss!sass' },

			// Support for *.json files.
			{ test: /\.json$/, loader: 'json' },

			// support for .html as raw text
			{ test: /\.html$/, loader: 'raw' }
		],

		postLoaders: [],

		noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /angular2-polyfills\.js/]
	}

	config.plugins = [
		// Define env variables to help with builds
		// Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
		new DefinePlugin({
			'IS_PROD': IS_PROD,
			'ENV': JSON.stringify(ENV),
			'HMR': HMR,
			'process.env': {
				'ENV': JSON.stringify(ENV),
				'NODE_ENV': JSON.stringify(ENV),
				'HMR': HMR,
			}
		}),

		// Generate common chunks if necessary
		// Reference: https://webpack.github.io/docs/code-splitting.html
		// Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
		new CommonsChunkPlugin({
			name: ['app', 'vendor', 'polyfills']
		}),

		// Inject script and link tags into html files
		// Reference: https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			template: src('public', 'main.ejs'),
			chunksSortMode: 'dependency',
			minify: false,
			inject: 'head',
			baseUrl: BASE_URL
		}),

		// Extract css files
		// Reference: https://github.com/webpack/extract-text-webpack-plugin
		// new ExtractTextPlugin({
		// 	filename: 'css/[name].[hash].css',
		// 	disable: !IS_PROD
		// }),

		new ContextReplacementPlugin(
			/angular\/core\/(esm\/src|src)\/linker/,
			src()
		)
	]

	config.htmlLoader = {
		minimize: false // workaround for ng2
	}


	// Add build specific plugins
	if (IS_PROD) {
		config.plugins.push(
			// Only emit files when there are no errors
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
			new webpack.NoErrorsPlugin(),

			// Dedupe modules in the output
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
			new webpack.optimize.DedupePlugin(),

			// Minify all javascript, switch loaders to minimizing mode
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
			new webpack.optimize.UglifyJsPlugin({mangle: { keep_fnames: true }}),

			// Copy assets from the public folder
			// Reference: https://github.com/kevlened/copy-webpack-plugin
			new CopyWebpackPlugin([{
				from: src('public'),
				ignore: [
					'*.scss',
					'main.ejs'
				]
			}])
		)
	} else {
		config.plugins.push(
			// Do type checking in a separate process, so webpack don't need to wait.
			// Reference: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
			new AwesomeTypescriptLoader.ForkCheckerPlugin(),
			new DashboardPlugin()
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
		contentBase: src('public'),
		historyApiFallback: true,
		stats: 'minimal'
	}

	return config
}()

// HELPERS

function root() {
	return path.join(__dirname, ...arguments)
}

function src() {
	return path.join(__dirname, 'src', ...arguments)
}

function hasProcessFlag(flag) {
	return process.argv.join('').indexOf(flag) > -1;
}

function isWebpackDevServer() {
	return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}
