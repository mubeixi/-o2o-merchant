// vue.config.js
const environment = require('./build/environment.ts')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const path = require('path')
const fs = require('fs')

module.exports = {
  // options...
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: fs.readFileSync('src/assets/css/variable.scss', 'utf-8'),
        implementation: require('sass') // This line must in sass option
      },
      scss: {
        prependData: fs.readFileSync('src/assets/css/variable.scss', 'utf-8'),
        implementation: require('sass') // This line must in sass option
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        // 引用动态链接库
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, './build/dll/libs-manifest.json')
        })
      )
      config.plugins.push(
        // 将 dll 注入到 生成的 html 模板中
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: path.resolve(__dirname, './build/dll/*.js'),
          // dll 引用路径
          publicPath: 'dll',
          // dll最终输出的目录
          outputPath: 'dll'
        })
      )
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://newo2o.bafangka.com/api', // 'https://new401t.bafangka.com/api',
        changeOrigin: true,
        // http2: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }

  }
}
