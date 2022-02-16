import * as path from "path";

import * as webpack from "webpack";
import "webpack-dev-server";

/* eslint-disable @typescript-eslint/no-var-requires */
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");

const isDevelopment = process.env.NODE_ENV !== "production";

const config: webpack.Configuration = {
  mode: isDevelopment ? "development" : "production",
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "main.js",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: isDevelopment,
              configFile: "tsconfig.json",
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "../public"),
    },
    compress: !isDevelopment,
    port: 9000,
    hot: true,
  },
};

export default config;
