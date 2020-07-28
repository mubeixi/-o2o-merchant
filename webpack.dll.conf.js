const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const vendors = [
  [
    'vue', 'vuex', 'vue-resource','vue-router','vue-class-component','vue-lazyload'
  ],
   [
    'echarts'
  ], [
    'element-ui'
  ],[
    'fabric','html2canvas','qrcode.vue','js-cookie'
  ]
]

// dll文件存放的目录
const dllPath = './build/dll'
module.exports = {
  entry: { // 多入口，单入口情况，只需写一个，key值自定义，value值为数组
    vue: vendors[0],
    echarts: vendors[1],
    elementUI: vendors[2],
    libs: vendors[3],
  },
  output: {
    path: path.join(__dirname, dllPath),
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_[chunkhash]'
  },
  plugins: [
    // 清除之前的dll文件
    new CleanWebpackPlugin(),
    // new UglifyJsPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, '[name]-manifest.json'),
      name: '[name]_[chunkhash]',
      context: __dirname
    })
  ]
}
