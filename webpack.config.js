const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const pkg = require("./package.json")
const src = path.join(__dirname, "src")

module.exports = {

  mode: "development",

  devServer: {
    stats: {
      children: false,
      cached: false,
      cachedAssets: false,
      modules: false
    }
  },

  target: "electron-renderer",

  externals: {
    "electron-store": "require('electron-store')",
    "conf": "require('conf')"
  },

  entry: [
    "react-hot-loader/patch",
    path.join(src, "index.js"),
    path.join(src, "index.html"),
    path.join(src, "arrow.html")
  ],

  resolve: {

    extensions: [
      ".js",
      ".less",
      ".css",
      ".svg"
    ],

    modules: [
      path.resolve("./src"),
      "node_modules"
    ]

  },

  module: {

    rules: [

      {
        test: /\.html?$/,
        include: src,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].html"
          }
        }]
      },

      {
        test: /\.js$/,
        include: src,
        use: "babel-loader"
      },

      {
        test: /\.less$/,
        include: src,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => {
                return [
                  require("autoprefixer")
                ]
              }
            }
          },
          {
            loader: "less-loader",
            options: {
              includePaths: [
                "src/styles/"
              ]
            }
          }
        ]
      },

      {
        test: /\.svg$/,
        include: src,
        use: [
          "babel-loader",
          {
            loader: "react-svg-loader",
            options: {
              jsx: true
            }
          }
        ]
      }

    ]

  },

  output: {
    path: path.join(__dirname, "build"),
    publicPath: "http://localhost:3000/",
    filename: `${pkg.name}.js`
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: "src/static",
        to: "static"
      }
    ])
  ]

}
