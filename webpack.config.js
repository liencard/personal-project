const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require("postcss-preset-env");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, { mode }) => {
  console.log(mode);
  return {
    output: {
      filename: "[name].[hash].js",
    },
    entry: {
      index: "./src/index.js",
      overview: "./src/overview.js",
      detail: "./src/detail.js",
      info: "./src/detail.js",
    },
    devServer: {
      overlay: true,
      hot: true,
      contentBase: path.join(__dirname, "src"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-srcsets-loader",
              options: {
                attrs: [":src", ":srcset"],
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|svg|webp|mp4)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 5000,
              context: "./src",
              name: "[path][name].[ext]",
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
            "resolve-url-loader",
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                plugins: [
                  require("postcss-import"),
                  postcssPresetEnv({ stage: 0 }),
                ],
              },
            },
          ],
        },
        {
          // match all .gltf files
          test: /\.(gltf)$/,
          use: [{ loader: "gltf-webpack-loader" }],
        },
        {
          // here I match only IMAGE and BIN files under the gltf folder
          test: /gltf.*\.(bin|png|jpe?g|svg|gif|mp4)$/,
          // or use url-loader if you would like to embed images in the source gltf
          loader: "file-loader",
          options: {
            // output folder for bin and image files, configure as needed
            name: "gltf/[name].[hash:7].[ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html",
        chunks: ["index"],
      }),
      new HtmlWebPackPlugin({
        template: "./src/overview.html",
        filename: "./overview.html",
        chunks: ["overview"],
      }),
      new HtmlWebPackPlugin({
        template: "./src/detail.html",
        filename: "./detail.html",
        chunks: ["detail"],
      }),
      new HtmlWebPackPlugin({
        template: "./src/info.html",
        filename: "./info.html",
        chunks: ["info"],
      }),
      new MiniCssExtractPlugin({
        filename: "style.[contenthash].css",
      }),
      new OptimizeCSSAssetsPlugin(),
      new CopyPlugin([
        { from: "assets/**/*.mp4", context: "src" },
        { from: "assets/**/*.svg", context: "src" },
        { from: "assets/**/*.png", context: "src" }, //added to copy mp4 files to dist folder
      ]),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
