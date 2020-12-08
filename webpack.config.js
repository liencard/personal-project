const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require("postcss-preset-env");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, { mode }) => {
  console.log(mode);
  return {
    output: {
      path: `${__dirname}/public`,
      filename: "[name].[hash].js",
    },
    devServer: {
      overlay: true,
      hot: true,
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
          test: /\.(jpe?g|png|svg|webp)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 1000,
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
          test: /gltf.*\.(bin|png|jpe?g|gif)$/,
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
      }),
      new MiniCssExtractPlugin({
        filename: "style.[contenthash].css",
      }),
      new OptimizeCSSAssetsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
