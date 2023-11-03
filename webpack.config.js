const path = require('path');

module.exports = {
  entry: './src/index.js',  // 你的 React 應用的入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),  // 打包後的文件放在 'dist' 文件夾
    filename: 'main.js',  // 打包後的文件名為 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  // 匹配 JavaScript 和 JSX 文件
        exclude: /node_modules/,  // 排除 node_modules 文件夾
        use: ['babel-loader'],  // 使用 babel-loader 來轉譯 JavaScript 和 JSX
      },
      {
        test: /\.css$/,  // 匹配 CSS 文件
        use: ['style-loader', 'css-loader'],  // 使用 style-loader 和 css-loader 來處理 CSS
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],  // 在 import 語句中可以省略這些擴充名
  },
};