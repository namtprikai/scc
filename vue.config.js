const webpack = require('webpack');
const path = require('path');
// const { VueLoaderPlugin } = require('vue-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CLIENT_ID = (process.env.CLIENT_ID || '392').trim();
const API_CLIENT_ID = (process.env.API_CLIENT_ID || CLIENT_ID || '392').trim();
console.log('API_CLIENT_ID', API_CLIENT_ID);
const CONFIG_CLIENT_ID = (process.env.CONFIG_CLIENT_ID||'').trim();
const FOLDER = process.env.FOLDER || 'test';
const CONSOLE_TYPE = (process.env.CONSOLE_TYPE || '').trim();
const PRODUCT_WINDOW_URL = (process.env.PRODUCT_WINDOW_URL || '').trim();
const DEV_WINDOW_URL = (process.env.DEV_WINDOW_URL || '').trim();
const SILENT = process.env.SILENT !== undefined;
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const mockServerPort = 9528 // TODO: get this variable from setting.ts
const tsconfig = JSON.parse(fs.readFileSync('./tsconfigrc.json', 'utf-8'));
let pconfigPath = `src/productConfigById/${CONFIG_CLIENT_ID||CLIENT_ID}/*`;
tsconfig['compilerOptions']['paths']['@consoletype/*'] = [`src/products/${CONSOLE_TYPE}/*`];
tsconfig['compilerOptions']['paths']['@pconfig/*'] = [pconfigPath];
// exclude
console.log(tsconfig['exclude']);
console.log(CONSOLE_TYPE);
if (CONSOLE_TYPE && Array.isArray(tsconfig['exclude'])) {
	const exclude = tsconfig['exclude'];
	const dirs = fs.readdirSync('src/products');
	for (const dir of dirs) {
		if (dir !== CONSOLE_TYPE && dirs.indexOf(dir) !== -1) {
			exclude.push(`src/products/${dir}/**`);
		}
	}
	tsconfig['exclude'] = exclude;
}

fs.writeFileSync('./tsconfig.json', JSON.stringify(tsconfig));
console.log(process.env.BASE_URL);

/* tslint で対象プロダクトとコア以外を除外する */
// const tslintconfig = require('.eslintrc.js');
// let tslintexc = ["node_modules/**"];
// if (!SILENT) {
// 	const dirs = fs.readdirSync("src/products");
// 	for (const dir of dirs) {
// 		if (dir !== PRODUCT) tslintexc.push(`src/products/${dir}/**`);
// 	}
// } else {
// 	tslintexc.push("src/**");
// }
// tslintconfig["linterOptions"]["exclude"] = tslintexc;
// fs.writeFileSync("./tslint.json", JSON.stringify(tslintconfig))

module.exports = {
	lintOnSave: false, //process.env.NODE_ENV !== "production",
	parallel: false,
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production' ? `/${FOLDER}/` : '/',
	pwa: {
		name: 'vue-typescript-admin-template',
	},
	filenameHashing: false,
	devServer: {
		inline: false,
		port: 5000,
		contentBase: path.resolve(__dirname, 'public'),
		host: 'localhost',
		disableHostCheck: true,
		open: true,
		openPage: '',
		hot: true,
		proxy: {
			// change xxx-api/login => /mock-api/v1/login
			// detail: https://cli.vuejs.org/config/#devserver-proxy
			[process.env.VUE_APP_BASE_API]: {
					target: `http://127.0.0.1:${mockServerPort}/${process.env.VUE_APP_BASE_API}`,
					changeOrigin: true, // needed for virtual hosted sites
					ws: true, // proxy websockets
					pathRewrite: {
							['^' + process.env.VUE_APP_BASE_API]: ''
					}
			}
	}
	},
	configureWebpack: {
		entry: {
			app: `./src/products/${CONSOLE_TYPE}/main.ts`,
		},
		module: {
			rules: [
				// {
				// 	test: /\.vue$/,
				// 	loader: 'vue-loader',
				// 	options: {
				// `loaders` はデフォルトの loaderを上書きします。
				// 次の設定では、`lang` 属性のない全ての `<script>` タグに
				// `coffee-loader` が適用されます。
				// loaders: {
				// ts: 'ts-loader'
				// },
				// `preLoaders` はデフォルトの loader の前に付加されます。
				// これを使用して言語ブロックを前処理することができます。
				// 一般的な使用例はビルドタイム i18n です。
				// preLoaders: {
				//   js: '/path/to/custom/loader'
				// },
				// `postLoaders` はデフォルトの loader の後につけられます。
				//
				// - `html` の場合、デフォルトの loader によって返される結果は、
				//   コンパイルされた JavaScript レンダリング関数コードになります。
				//
				// - `css` の場合、結果は `vue-style-loader` によって返されます。
				//   しかしこれはほとんどの場合特に有用ではありません。
				//   PostCSS プラグインを使用する方が良い選択になります。
				// postLoaders: {
				//   html: 'babel-loader'
				// },
				// `excludedPreLoaders` は正規表現で設定する必要があります。
				// excludedPreLoaders: /(eslint-loader)/
				// 	}
				// }
				// {
				// 	test: /\.js$/,
				// 	exclude: /node_modules/,
				// 	loader: 'babel-loader',
				// },
				// {
				// 	test: /\.json$/,
				// 	loader: 'json-loader'
				// }
			],
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: { drop_console: true },
					},
				}),
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || ''),
				'process.env.CLIENT_ID': JSON.stringify(CLIENT_ID || ''),
				'process.env.API_CLIENT_ID': JSON.stringify(API_CLIENT_ID || ''),
        'process.env.CONSOLE_TYPE': JSON.stringify(process.env.CONSOLE_TYPE || ''),
        'process.env.PRODUCT_WINDOW_URL': JSON.stringify(process.env.PRODUCT_WINDOW_URL || ''),
        'process.env.DEV_WINDOW_URL': JSON.stringify(process.env.DEV_WINDOW_URL || ''),
			}),
			new webpack.HotModuleReplacementPlugin(),
			new ForkTsCheckerWebpackPlugin(),
			// new VueLoaderPlugin()
		],

		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.html', '.ejs', '.ico', '.vue', '.mp3', '.wav'],
			alias: {
				vue$: 'vue/dist/vue.esm.js',
				'@': path.resolve(__dirname, `src/core`),
				'~': path.resolve(__dirname, 'src/'),
				'@pconfig': path.resolve(__dirname, `src/productConfigById/${CONFIG_CLIENT_ID||CLIENT_ID}`),
				'@consoletype': path.resolve(__dirname, `src/products/${CONSOLE_TYPE}`),
				'bootstrap-components': path.resolve(__dirname, 'node_modules/bootstrap-vue/es/components'),
			},
			modules: [
				path.resolve(__dirname, `src/productConfigById/${CONFIG_CLIENT_ID||CLIENT_ID}`),
				path.resolve(__dirname, `src/products/${CONSOLE_TYPE}`),
				path.resolve(__dirname, `./src`),
				path.resolve(__dirname, `./`),
				path.resolve(__dirname, `./src/core`),
				'node_modules',
			],
		},
	},
	chainWebpack(config) {
		// config.resolve.alias.delete("@")
		// 		console.log("alias", config.resolve.alias);
		console.log(config);
		// config.module.rule('vue')
		// 	.use('vue-loader')
		// 	.loader('vue-loader')
		// 	.tap(options => {
		// 		// modify the options...
		// 		return options
		// 	});
		// config.module.rule("vue").uses.delete("cache-loader");
		// config.module.rule("js").uses.delete("cache-loader");
		// config.module.rule("ts").uses.delete("cache-loader");
		// config.module.rule("tsx").uses.delete("cache-loader");
		// config.plugins.delete("fork-ts-checker");
		config.plugin('fork-ts-checker').tap(args => {
			args[0].memoryLimit = 16000;
			return args;
		});
		// config.resolve
		// 	.plugin("tsconfig-paths")
		// 	.use(require("tsconfig-paths-webpack-plugin"))
	},
};
