const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    popup: path.resolve("./src/popup.tsx"),
    // options: path.resolve('./src/option.tsx')
    background: path.resolve("./src/background/background.ts"),
    contentScript: path.resolve("./src/content/contentScript"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.css$/, // 匹配 CSS 文件
        use: ["style-loader", "css-loader"], // 使用 style-loader 和 css-loader 來處理 CSS
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "img/resource",
        use: "img/resource",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve("src/manifest.json"), to: path.resolve("dist") },
        { from: path.resolve("src/img"), to: path.resolve("dist/img") },
      ],
    }),
    new HtmlPlugin({
      title: "Teddys Jira Assistant",
      template: path.resolve("./src/popup.html"),
      filename: "popup.html",
      chunks: ["popup"],
    }),
  ],
  resolve: {
    extensions: [".*", ".js", ".jsx", ".tsx", ".ts"],
  },
  output: {
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
