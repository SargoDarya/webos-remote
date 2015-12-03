module.exports = {
  context: __dirname,
  entry: './public/js/remote.jsx',
  output: {
    path: __dirname + '/public/js/',
    filename: 'app.js'
  },
  module: {
  	loaders: [
      {
      	test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?presets[]=react&presets[]=es2015',
      }
    ]
  }
};