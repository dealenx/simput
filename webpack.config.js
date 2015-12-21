var webpack = require('webpack');

module.exports = {
  plugins: [],
  entry: './lib/index.js',
  output: {
    path: './dist',
    filename: 'Simput.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ],
    loaders: [
      { test: require.resolve("./lib/index.js"), loader: "expose?Simput" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=60000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=60000" },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      { test: /\.css$/, loader: "style-loader!css-loader!autoprefixer-loader?browsers=last 2 version" },
      { test: /\.c$/i, loader: "shader" },
      { test: /\.js$/, include: /node_modules\/tonic-/, loader: "babel?presets[]=react,presets[]=es2015" },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel?presets[]=react,presets[]=es2015" }
    ]
  },
  eslint: {
    configFile: '.eslintrc'
  },
  externals: {
    "three": "THREE"
  }
};
